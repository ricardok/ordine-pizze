import { calculateFinalPrice, type DiscountInput } from '../discountEngine';

describe('Discount Engine', () => {
  const baseInput: DiscountInput = {
    basePrice: 20.00,
    hasLoyaltyCard: false,
    isDisabled: false,
    isEarlyDiner: false,
    groupSize: null,
    orderDate: new Date('2024-01-15T15:00:00.000Z') // Monday 15:00 Rome time
  };

  describe('calculateFinalPrice', () => {
    describe('Input validation', () => {
      it('should throw error for negative base price', () => {
        expect(() => calculateFinalPrice({ ...baseInput, basePrice: -10 }))
          .toThrow('Base price cannot be negative');
      });

      it('should throw error for negative age', () => {
        expect(() => calculateFinalPrice({ ...baseInput, age: -1 }))
          .toThrow('Age cannot be negative');
      });

      it('should throw error for negative group size', () => {
        expect(() => calculateFinalPrice({ ...baseInput, groupSize: -5 }))
          .toThrow('Group size cannot be negative');
      });

      it('should accept null group size', () => {
        const result = calculateFinalPrice({ ...baseInput, groupSize: null });
        expect(result).toBeDefined();
      });

      it('should accept undefined group size', () => {
        const input = { ...baseInput };
        delete (input as Partial<DiscountInput>).groupSize;
        const result = calculateFinalPrice(input as DiscountInput);
        expect(result).toBeDefined();
      });
    });

    describe('Disability discount (Priority 1 - 90%)', () => {
      it('should apply 90% disability discount', () => {
        const result = calculateFinalPrice({ ...baseInput, isDisabled: true });
        expect(result.discountApplied).toBe('Disability Discount');
        expect(result.discountPercentage).toBe(90);
        expect(result.discountAmount).toBe(18.00);
        expect(result.finalPrice).toBe(5.00);
        expect(result.priceFloorApplied).toBe(true);
      });

      it('should apply price floor when disability discount goes below €5', () => {
        const result = calculateFinalPrice({ 
          ...baseInput, 
          basePrice: 10.00, 
          isDisabled: true 
        });
        expect(result.discountApplied).toBe('Disability Discount');
        expect(result.discountAmount).toBe(9.00);
        expect(result.finalPrice).toBe(5.00);
        expect(result.priceFloorApplied).toBe(true);
      });

      it('should prioritize disability over senior discount', () => {
        const result = calculateFinalPrice({ 
          ...baseInput, 
          isDisabled: true, 
          age: 65 
        });
        expect(result.discountApplied).toBe('Disability Discount');
        expect(result.discountPercentage).toBe(90);
      });

      it('should not apply disability discount when group is present', () => {
        const result = calculateFinalPrice({ 
          ...baseInput, 
          isDisabled: true, 
          groupSize: 15 
        });
        expect(result.discountApplied).toBe('Group Discount (15-20 people)');
        expect(result.discountPercentage).toBe(20);
      });

      it('should apply disability discount when no group is present', () => {
        const result = calculateFinalPrice({ 
          ...baseInput, 
          isDisabled: true, 
          groupSize: null
        });
        expect(result.discountApplied).toBe('Disability Discount');
        expect(result.discountPercentage).toBe(90);
      });

      it('should apply disability discount when group size is 0', () => {
        const result = calculateFinalPrice({ 
          ...baseInput, 
          isDisabled: true, 
          groupSize: 0
        });
        expect(result.discountApplied).toBe('Disability Discount');
        expect(result.discountPercentage).toBe(90);
      });
    });

    describe('Senior discount (Priority 2 - 70%)', () => {
      it('should apply 70% senior discount for age 60', () => {
        const result = calculateFinalPrice({ ...baseInput, age: 60 });
        expect(result.discountApplied).toBe('Senior Discount');
        expect(result.discountPercentage).toBe(70);
        expect(result.discountAmount).toBe(14.00);
        expect(result.finalPrice).toBe(6.00);
      });

      it('should apply 70% senior discount for age over 60', () => {
        const result = calculateFinalPrice({ ...baseInput, age: 75 });
        expect(result.discountApplied).toBe('Senior Discount');
        expect(result.discountPercentage).toBe(70);
      });

      it('should not apply senior discount for age 59', () => {
        const result = calculateFinalPrice({ ...baseInput, age: 59 });
        expect(result.discountApplied).not.toBe('Senior Discount');
      });

      it('should not apply senior discount when group is present', () => {
        const result = calculateFinalPrice({ 
          ...baseInput, 
          age: 65, 
          groupSize: 20 
        });
        expect(result.discountApplied).toBe('Group Discount (15-20 people)');
        expect(result.discountPercentage).toBe(20);
      });

      it('should apply senior discount when no group is present', () => {
        const result = calculateFinalPrice({ 
          ...baseInput, 
          age: 65, 
          groupSize: null
        });
        expect(result.discountApplied).toBe('Senior Discount');
        expect(result.discountPercentage).toBe(70);
      });

      it('should apply senior discount when group size is 0', () => {
        const result = calculateFinalPrice({ 
          ...baseInput, 
          age: 65, 
          groupSize: 0
        });
        expect(result.discountApplied).toBe('Senior Discount');
        expect(result.discountPercentage).toBe(70);
      });
    });

    describe('Group discounts (Priority 3)', () => {
      it('should apply 20% discount for 15 people', () => {
        const result = calculateFinalPrice({ ...baseInput, groupSize: 15 });
        expect(result.discountApplied).toBe('Group Discount (15-20 people)');
        expect(result.discountPercentage).toBe(20);
        expect(result.finalPrice).toBe(16.00);
      });

      it('should apply 20% discount for 20 people', () => {
        const result = calculateFinalPrice({ ...baseInput, groupSize: 20 });
        expect(result.discountApplied).toBe('Group Discount (15-20 people)');
        expect(result.discountPercentage).toBe(20);
      });

      it('should apply 30% discount for 21 people', () => {
        const result = calculateFinalPrice({ ...baseInput, groupSize: 21 });
        expect(result.discountApplied).toBe('Group Discount (21-24 people)');
        expect(result.discountPercentage).toBe(30);
        expect(result.finalPrice).toBe(14.00);
      });

      it('should apply 30% discount for 24 people', () => {
        const result = calculateFinalPrice({ ...baseInput, groupSize: 24 });
        expect(result.discountApplied).toBe('Group Discount (21-24 people)');
        expect(result.discountPercentage).toBe(30);
      });

      it('should apply 50% discount for 25 people', () => {
        const result = calculateFinalPrice({ ...baseInput, groupSize: 25 });
        expect(result.discountApplied).toBe('Group Discount (25+ people)');
        expect(result.discountPercentage).toBe(50);
        expect(result.finalPrice).toBe(10.00);
      });

      it('should apply 50% discount for more than 25 people', () => {
        const result = calculateFinalPrice({ ...baseInput, groupSize: 30 });
        expect(result.discountApplied).toBe('Group Discount (25+ people)');
        expect(result.discountPercentage).toBe(50);
      });

      it('should not apply group discount for 14 people', () => {
        const result = calculateFinalPrice({ ...baseInput, groupSize: 14 });
        expect(result.discountApplied).toBe(null);
      });
    });

    describe('Child discounts (Priority 4)', () => {
      it('should apply 50% discount for age under 4', () => {
        const result = calculateFinalPrice({ ...baseInput, age: 3 });
        expect(result.discountApplied).toBe('Child Discount (Under 4)');
        expect(result.discountPercentage).toBe(50);
        expect(result.finalPrice).toBe(10.00);
      });

      it('should apply 20% discount for age 4', () => {
        const result = calculateFinalPrice({ ...baseInput, age: 4 });
        expect(result.discountApplied).toBe('Child Discount (4-11 years)');
        expect(result.discountPercentage).toBe(20);
        expect(result.finalPrice).toBe(16.00);
      });

      it('should apply 20% discount for age 11', () => {
        const result = calculateFinalPrice({ ...baseInput, age: 11 });
        expect(result.discountApplied).toBe('Child Discount (4-11 years)');
        expect(result.discountPercentage).toBe(20);
      });

      it('should not apply child discount for age 12', () => {
        const result = calculateFinalPrice({ ...baseInput, age: 12 });
        expect(result.discountApplied).toBe(null);
      });

      it('should not apply child discount when group discount applies', () => {
        const input: DiscountInput = {
          basePrice: 30,
          hasLoyaltyCard: false,
          isDisabled: false,
          isEarlyDiner: false,
          age: 1, // Very young child that would qualify for 50% child discount
          groupSize: 25, // Group size that qualifies for 50% group discount
          orderDate: new Date('2024-01-15T15:00:00.000Z')
        }

        const result = calculateFinalPrice(input)

        // Group discount should take priority over child discount
        expect(result.discountApplied).toBe('Group Discount (25+ people)')
        expect(result.discountPercentage).toBe(50)
        expect(result.finalPrice).toBe(15.00)

        // Verify that child discount conditions are met but not applied
        const hasGroupDiscount = (input.groupSize ?? 0) >= 15
        const childConditionMet = input.age != null && input.age < 4
        expect(childConditionMet).toBe(true) // Child would qualify for discount
        expect(hasGroupDiscount).toBe(true) // But group discount prevents it
      })

      it('should prioritize group discount over child discount even for very young children', () => {
        const input: DiscountInput = {
          basePrice: 50,
          hasLoyaltyCard: false,
          isDisabled: false,
          isEarlyDiner: false,
          age: 1, // Very young child that would qualify for 50% child discount
          groupSize: 15, // Smallest group size that qualifies for group discount
          orderDate: new Date('2024-01-15T15:00:00.000Z')
        }

        const result = calculateFinalPrice(input)

        // Group discount should take priority
        expect(result.discountApplied).toBe('Group Discount (15-20 people)')
        expect(result.discountPercentage).toBe(20)
        expect(result.finalPrice).toBe(40.00)

        // Verify that child discount conditions are met but not applied
        const hasGroupDiscount = (input.groupSize ?? 0) >= 15
        const childConditionMet = input.age != null && input.age < 4
        expect(childConditionMet).toBe(true) // Child would qualify for discount
        expect(hasGroupDiscount).toBe(true) // But group discount prevents it
      })

      it('should apply child discount when no group is present', () => {
        // Test same child age but without group
        const input: DiscountInput = {
          basePrice: 30,
          hasLoyaltyCard: false,
          isDisabled: false,
          isEarlyDiner: false,
          age: 1, // Same young child
          groupSize: null, // No group this time
          orderDate: new Date('2024-01-15T15:00:00.000Z')
        }

        const result = calculateFinalPrice(input)

        // Should apply child discount
        expect(result.discountApplied).toBe('Child Discount (Under 4)')
        expect(result.discountPercentage).toBe(50)
        expect(result.finalPrice).toBe(15.00)
      })
    });

    describe('Loyalty card discount (Priority 5 - 15%)', () => {
      it('should apply 15% loyalty discount', () => {
        const result = calculateFinalPrice({ ...baseInput, hasLoyaltyCard: true });
        expect(result.discountApplied).toBe('Loyalty Card Discount');
        expect(result.discountPercentage).toBe(15);
        expect(result.finalPrice).toBe(17.00);
      });

      it('should not apply loyalty discount when higher priority discount applies', () => {
        const result = calculateFinalPrice({ 
          ...baseInput, 
          hasLoyaltyCard: true, 
          age: 65 
        });
        expect(result.discountApplied).toBe('Senior Discount');
        expect(result.discountPercentage).toBe(70);
      });
    });

    describe('Early diner / Weekend discount (Priority 6 - 10%)', () => {
      it('should apply 10% early diner discount when checkbox is checked', () => {
        const result = calculateFinalPrice({ 
          ...baseInput, 
          isEarlyDiner: true 
        });
        expect(result.discountApplied).toBe('Early Diner Discount');
        expect(result.discountPercentage).toBe(10);
        expect(result.finalPrice).toBe(18.00);
      });

      it('should not apply early diner discount when checkbox is not checked', () => {
        const result = calculateFinalPrice({ 
          ...baseInput, 
          isEarlyDiner: false 
        });
        expect(result.discountApplied).toBe(null);
        expect(result.discountPercentage).toBe(0);
        expect(result.finalPrice).toBe(20.00);
      });

      it('should apply 10% weekend discount (Saturday)', () => {
        // Saturday
        const saturdayDate = new Date('2024-01-13T20:00:00.000Z');
        const result = calculateFinalPrice({ 
          ...baseInput, 
          orderDate: saturdayDate 
        });
        expect(result.discountApplied).toBe('Weekend Discount');
        expect(result.discountPercentage).toBe(10);
      });

      it('should apply 10% weekend discount (Sunday)', () => {
        // Sunday
        const sundayDate = new Date('2024-01-14T20:00:00.000Z');
        const result = calculateFinalPrice({ 
          ...baseInput, 
          orderDate: sundayDate 
        });
        expect(result.discountApplied).toBe('Weekend Discount');
        expect(result.discountPercentage).toBe(10);
      });

      it('should not apply early diner discount on weekend when checkbox is checked', () => {
        // Saturday with early diner checkbox
        const saturdayDate = new Date('2024-01-13T20:00:00.000Z');
        const result = calculateFinalPrice({ 
          ...baseInput, 
          isEarlyDiner: true,
          orderDate: saturdayDate 
        });
        expect(result.discountApplied).toBe('Weekend Discount');
        expect(result.discountPercentage).toBe(10);
      });

      it('should not apply early diner/weekend discount when higher priority applies', () => {
        const result = calculateFinalPrice({ 
          ...baseInput, 
          isEarlyDiner: true,
          hasLoyaltyCard: true 
        });
        expect(result.discountApplied).toBe('Loyalty Card Discount');
        expect(result.discountPercentage).toBe(15);
      });

      it('should not apply discount for weekday when early diner is not checked', () => {
        // Monday without early diner
        const result = calculateFinalPrice({ 
          ...baseInput, 
          isEarlyDiner: false
        });
        expect(result.discountApplied).toBe(null);
        expect(result.discountPercentage).toBe(0);
        expect(result.finalPrice).toBe(20.00);
      });
    });

    describe('No discount scenarios', () => {
      it('should apply no discount for regular adult on weekday', () => {
        const result = calculateFinalPrice({ 
          ...baseInput 
        });
        expect(result.discountApplied).toBe(null);
        expect(result.discountPercentage).toBe(0);
        expect(result.discountAmount).toBe(0);
        expect(result.finalPrice).toBe(20.00);
        expect(result.priceFloorApplied).toBe(false);
      });

      it('should apply no discount when age is not provided', () => {
        const result = calculateFinalPrice({ 
          ...baseInput 
        });
        expect(result.discountApplied).toBe(null);
        expect(result.discountPercentage).toBe(0);
        expect(result.discountAmount).toBe(0);
        expect(result.finalPrice).toBe(20.00);
        expect(result.priceFloorApplied).toBe(false);
      });
    });

    describe('Price floor scenarios', () => {
      it('should apply price floor when final price is below €5', () => {
        const result = calculateFinalPrice({ 
          ...baseInput, 
          basePrice: 5.50, 
          isDisabled: true 
        });
        expect(result.finalPrice).toBe(5.00);
        expect(result.priceFloorApplied).toBe(true);
      });

      it('should not apply price floor when final price is exactly €5', () => {
        const result = calculateFinalPrice({ 
          ...baseInput, 
          basePrice: 16.67, 
          age: 65 // 70% discount
        });
        expect(result.finalPrice).toBe(5.00);
        expect(result.priceFloorApplied).toBe(false);
      });

      it('should not apply price floor when final price is above €5', () => {
        const result = calculateFinalPrice({ 
          ...baseInput, 
          basePrice: 20.00, 
          hasLoyaltyCard: true 
        });
        expect(result.finalPrice).toBe(17.00);
        expect(result.priceFloorApplied).toBe(false);
      });
    });

    describe('Rounding scenarios', () => {
      it('should round final price to 2 decimal places', () => {
        const result = calculateFinalPrice({ 
          ...baseInput, 
          basePrice: 10.33, 
          hasLoyaltyCard: true // 15% discount
        });
        expect(result.finalPrice).toBe(8.78); // 10.33 * 0.85 = 8.7805
        expect(result.discountAmount).toBe(1.55); // 10.33 * 0.15 = 1.5495
      });
    });

    describe('Timezone scenarios', () => {
      it('should handle different timezones correctly for weekend discount', () => {
        // Saturday in different timezone
        const utcDate = new Date('2024-01-13T18:00:00.000Z');
        const result = calculateFinalPrice({ 
          ...baseInput, 
          orderDate: utcDate 
        });
        expect(result.discountApplied).toBe('Weekend Discount');
      });

      it('should handle different timezones correctly for weekday', () => {
        // Monday in different timezone
        const utcDate = new Date('2024-01-15T20:00:00.000Z');
        const result = calculateFinalPrice({ 
          ...baseInput, 
          orderDate: utcDate 
        });
        expect(result.discountApplied).toBe(null);
      });
    });
  });
}); 