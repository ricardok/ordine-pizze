import { format } from 'date-fns-tz';

export interface DiscountInput {
  basePrice: number;
  hasLoyaltyCard: boolean;
  isDisabled: boolean;
  age?: number | null | undefined;
  groupSize?: number | null | undefined;
  orderDate: Date;
}

export interface DiscountResult {
  originalPrice: number;
  finalPrice: number;
  discountApplied: string | null;
  discountPercentage: number;
  discountAmount: number;
  priceFloorApplied: boolean;
}

interface DiscountRule {
  name: string;
  percentage: number;
  priority: number;
  condition: (input: DiscountInput) => boolean;
}

const PRICE_FLOOR = 5.0;
const ROME_TIMEZONE = 'Europe/Rome';


const DISCOUNT_RULES: DiscountRule[] = [
  // Priority 1: Disability discount (highest priority) - only if no group
  {
    name: 'Disability Discount',
    percentage: 90,
    priority: 1,
    condition: (input) => input.isDisabled && (!input.groupSize || input.groupSize === 0)
  },

  // Priority 2: Senior discount - only if no group
  {
    name: 'Senior Discount',
    percentage: 70,
    priority: 2,
    condition: (input) => input.age != null && input.age >= 60 && (!input.groupSize || input.groupSize === 0)
  },

  // Priority 3: Group discounts (mutually exclusive)
  {
    name: 'Group Discount (25+ people)',
    percentage: 50,
    priority: 3,
    condition: (input) => (input.groupSize ?? 0) >= 25
  },
  {
    name: 'Group Discount (21-24 people)',
    percentage: 30,
    priority: 3,
    condition: (input) => (input.groupSize ?? 0) >= 21 && (input.groupSize ?? 0) <= 24
  },
  {
    name: 'Group Discount (15-20 people)',
    percentage: 20,
    priority: 3,
    condition: (input) => (input.groupSize ?? 0) >= 15 && (input.groupSize ?? 0) <= 20
  },

  // Priority 4: Child discounts (only if no group discount)
  {
    name: 'Child Discount (Under 4)',
    percentage: 50,
    priority: 4,
    condition: (input) => {
      const hasGroupDiscount = (input.groupSize ?? 0) >= 15;
      return input.age != null && input.age < 4 && !hasGroupDiscount;
    }
  },
  {
    name: 'Child Discount (4-11 years)',
    percentage: 20,
    priority: 4,
    condition: (input) => {
      const hasGroupDiscount = (input.groupSize ?? 0) >= 15;
      // Children under 12 years but 4 or older (to avoid overlap with 50% discount)
      return input.age != null && input.age >= 4 && input.age < 12 && !hasGroupDiscount;
    }
  },

  // Priority 5: Loyalty card discount
  {
    name: 'Loyalty Card Discount',
    percentage: 15,
    priority: 5,
    condition: (input) => input.hasLoyaltyCard
  },

  // Priority 6: Weekend discount (only if no other discount applied)
  {
    name: 'Weekend Discount',
    percentage: 10,
    priority: 6,
    condition: (input) => isWeekend(input.orderDate)
  },

  // Priority 7: Early diner discount (only if no other discount applied)
  {
    name: 'Early Diner Discount',
    percentage: 10,
    priority: 7,
    condition: (input) => isEarlyDiner(input.orderDate) && !isWeekend(input.orderDate)
  }
];

function isEarlyDiner(orderDate: Date): boolean {
  const romeTime = format(orderDate, 'HH:mm', { timeZone: ROME_TIMEZONE });
  const hour = parseInt(romeTime.split(':')[0], 10);
  return hour < 20;
}


function isWeekend(orderDate: Date): boolean {
  // date-fns-tz to get the day of week in Rome timezone
  const romeDayOfWeek = format(orderDate, 'i', { timeZone: ROME_TIMEZONE });
  const dayOfWeek = parseInt(romeDayOfWeek, 10);
  return dayOfWeek === 6 || dayOfWeek === 7; // Saturday = 6, Sunday = 7 in ISO format
}

export function calculateFinalPrice(input: DiscountInput): DiscountResult {
  // Validate inputs
  if (input.basePrice < 0) {
    throw new Error('Base price cannot be negative');
  }
  if (input.age != null && input.age < 0) {
    throw new Error('Age cannot be negative');
  }
  if (input.groupSize !== null && input.groupSize !== undefined && input.groupSize < 0) {
    throw new Error('Group size cannot be negative');
  }

  let appliedDiscount: DiscountRule | null = null;

  // Find the highest priority applicable discount
  for (const rule of DISCOUNT_RULES) {
    if (rule.condition(input)) {
      // Special handling for early-bird/weekend discount
      if (rule.name === 'Early Diner Discount' || rule.name === 'Weekend Discount') {
        // Only apply if no other discount has been found
        if (appliedDiscount === null) {
          appliedDiscount = rule;
        }
      } else {
        appliedDiscount = rule;
        break; // Stop at first applicable discount (highest priority)
      }
    }
  }

  // Calculate discount amount and final price
  const discountPercentage = appliedDiscount?.percentage ?? 0;
  const discountAmount = (input.basePrice * discountPercentage) / 100;
  let finalPrice = input.basePrice - discountAmount;

  // Apply price floor
  const priceFloorApplied = finalPrice < PRICE_FLOOR;
  if (priceFloorApplied) {
    finalPrice = PRICE_FLOOR;
  }

  return {
    originalPrice: input.basePrice,
    finalPrice: Math.round(finalPrice * 100) / 100,
    discountApplied: appliedDiscount?.name ?? null,
    discountPercentage,
    discountAmount: Math.round(discountAmount * 100) / 100,
    priceFloorApplied
  };
}

export function getDiscountRules(): Readonly<DiscountRule[]> {
  return Object.freeze([...DISCOUNT_RULES]);
}

export function validateDiscountInput(input: Partial<DiscountInput>): string[] {
  const errors: string[] = [];

  if (typeof input.basePrice !== 'number' || input.basePrice < 0) {
    errors.push('Base price must be a non-negative number');
  }

  if (input.age != null) {
    if (typeof input.age !== 'number') {
      errors.push('Age must be a non-negative number');
    } else if (input.age < 0) {
      errors.push('Age cannot be negative');
    }
  }

  if (typeof input.hasLoyaltyCard !== 'boolean') {
    errors.push('Loyalty card status must be a boolean');
  }

  if (typeof input.isDisabled !== 'boolean') {
    errors.push('Disability status must be a boolean');
  }

  if (input.groupSize !== null && input.groupSize !== undefined) {
    if (typeof input.groupSize !== 'number' || input.groupSize < 0) {
      errors.push('Group size must be null or a non-negative number');
    }
  }

  if (!(input.orderDate instanceof Date) || isNaN(input.orderDate.getTime())) {
    errors.push('Order date must be a valid Date object');
  }

  return errors;
} 