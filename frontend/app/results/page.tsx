'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

// Test cases data structure
const testCases = [
  { id: 1, name: "Test Case #1 (Son 1, Daughter 1)", relatives: { sons: 1, daughters: 1 } },
  { id: 2, name: "Test Case #2 (Son 1, Daughter 2)", relatives: { sons: 1, daughters: 2 } },
  { id: 3, name: "Test Case #3 (Son 2, Daughter 1)", relatives: { sons: 2, daughters: 1 } },
  { id: 4, name: "Test Case #4 (Son 2, Daughter 2)", relatives: { sons: 2, daughters: 2 } },
  { id: 5, name: "Test Case #5 (Son 3, Daughter 1)", relatives: { sons: 3, daughters: 1 } },
  { id: 6, name: "Test Case #6 (Son 1, Daughter 3)", relatives: { sons: 1, daughters: 3 } },
  { id: 7, name: "Test Case #7 (Wife 1, Son 1)", relatives: { wives: 1, sons: 1 } },
  { id: 8, name: "Test Case #8 (Wife 1, Son 2)", relatives: { wives: 1, sons: 2 } },
  { id: 9, name: "Test Case #9 (Wife 1, Daughter 1)", relatives: { wives: 1, daughters: 1 } },
  { id: 10, name: "Test Case #10 (Wife 1, Daughter 2)", relatives: { wives: 1, daughters: 2 } },
  { id: 11, name: "Test Case #11 (Wife 1, Son 1, Daughter 1)", relatives: { wives: 1, sons: 1, daughters: 1 } },
  { id: 12, name: "Test Case #12 (Wife 1, Son 1, Daughter 2)", relatives: { wives: 1, sons: 1, daughters: 2 } },
  { id: 13, name: "Test Case #13 (Wife 1, Son 2, Daughter 1)", relatives: { wives: 1, sons: 2, daughters: 1 } },
  { id: 14, name: "Test Case #14 (Wife 1, Son 2, Daughter 2)", relatives: { wives: 1, sons: 2, daughters: 2 } },
  { id: 15, name: "Test Case #15 (Wife 2, Son 1)", relatives: { wives: 2, sons: 1 } },
  { id: 16, name: "Test Case #16 (Wife 2, Daughter 1)", relatives: { wives: 2, daughters: 1 } },
  { id: 17, name: "Test Case #17 (Wife 2, Son 1, Daughter 1)", relatives: { wives: 2, sons: 1, daughters: 1 } },
  { id: 18, name: "Test Case #18 (Wife 3, Son 2, Daughter 1)", relatives: { wives: 3, sons: 2, daughters: 1 } },
  { id: 19, name: "Test Case #19 (Wife 4, Son 2, Daughter 2)", relatives: { wives: 4, sons: 2, daughters: 2 } },
  { id: 20, name: "Test Case #20 (Father 1, Son 1)", relatives: { father: 1, sons: 1 } },
  { id: 21, name: "Test Case #21 (Father 1, Daughter 1)", relatives: { father: 1, daughters: 1 } },
  { id: 22, name: "Test Case #22 (Father 1, Daughter 2)", relatives: { father: 1, daughters: 2 } },
  { id: 23, name: "Test Case #23 (Father 1, Son 1, Daughter 1)", relatives: { father: 1, sons: 1, daughters: 1 } },
  { id: 24, name: "Test Case #24 (Father 1, Son 2, Daughter 1)", relatives: { father: 1, sons: 2, daughters: 1 } },
  { id: 25, name: "Test Case #25 (Mother 1, Son 1)", relatives: { mother: 1, sons: 1 } },
  { id: 26, name: "Test Case #26 (Mother 1, Daughter 1)", relatives: { mother: 1, daughters: 1 } },
  { id: 27, name: "Test Case #27 (Mother 1, Daughter 2)", relatives: { mother: 1, daughters: 2 } },
  { id: 28, name: "Test Case #28 (Mother 1, Son 1, Daughter 1)", relatives: { mother: 1, sons: 1, daughters: 1 } },
  { id: 29, name: "Test Case #29 (Mother 1, Son 2, Daughter 2)", relatives: { mother: 1, sons: 2, daughters: 2 } },
  { id: 30, name: "Test Case #30 (Father 1, Mother 1)", relatives: { father: 1, mother: 1 } },
  { id: 31, name: "Test Case #31 (Father 1, Mother 1, Son 1)", relatives: { father: 1, mother: 1, sons: 1 } },
  { id: 32, name: "Test Case #32 (Father 1, Mother 1, Son 2)", relatives: { father: 1, mother: 1, sons: 2 } },
  { id: 33, name: "Test Case #33 (Father 1, Mother 1, Daughter 1)", relatives: { father: 1, mother: 1, daughters: 1 } },
  { id: 34, name: "Test Case #34 (Father 1, Mother 1, Daughter 2)", relatives: { father: 1, mother: 1, daughters: 2 } },
  { id: 35, name: "Test Case #35 (Father 1, Mother 1, Son 1, Daughter 1)", relatives: { father: 1, mother: 1, sons: 1, daughters: 1 } },
  { id: 36, name: "Test Case #36 (Father 1, Mother 1, Son 1, Daughter 2)", relatives: { father: 1, mother: 1, sons: 1, daughters: 2 } },
  { id: 37, name: "Test Case #37 (Father 1, Mother 1, Son 2, Daughter 1)", relatives: { father: 1, mother: 1, sons: 2, daughters: 1 } },
  { id: 38, name: "Test Case #38 (Father 1, Mother 1, Son 2, Daughter 2)", relatives: { father: 1, mother: 1, sons: 2, daughters: 2 } },
  { id: 39, name: "Test Case #39 (Wife 1, Father 1, Mother 1)", relatives: { wives: 1, father: 1, mother: 1 } },
  { id: 40, name: "Test Case #40 (Wife 1, Father 1, Mother 1, Son 1)", relatives: { wives: 1, father: 1, mother: 1, sons: 1 } },
  { id: 41, name: "Test Case #41 (Wife 1, Father 1, Mother 1, Daughter 1)", relatives: { wives: 1, father: 1, mother: 1, daughters: 1 } },
  { id: 42, name: "Test Case #42 (Wife 1, Father 1, Mother 1, Daughter 2)", relatives: { wives: 1, father: 1, mother: 1, daughters: 2 } },
  { id: 43, name: "Test Case #43 (Wife 1, Father 1, Mother 1, Son 1, Daughter 1)", relatives: { wives: 1, father: 1, mother: 1, sons: 1, daughters: 1 } },
  { id: 44, name: "Test Case #44 (Wife 1, Father 1, Mother 1, Son 1, Daughter 2)", relatives: { wives: 1, father: 1, mother: 1, sons: 1, daughters: 2 } },
  { id: 45, name: "Test Case #45 (Wife 1, Father 1, Mother 1, Son 2, Daughter 1)", relatives: { wives: 1, father: 1, mother: 1, sons: 2, daughters: 1 } },
  { id: 46, name: "Test Case #46 (Wife 1, Father 1, Mother 1, Son 2, Daughter 2)", relatives: { wives: 1, father: 1, mother: 1, sons: 2, daughters: 2 } },
  { id: 47, name: "Test Case #47 (Husband 1, Son 1)", relatives: { husband: 1, sons: 1 } },
  { id: 48, name: "Test Case #48 (Husband 1, Son 2)", relatives: { husband: 1, sons: 2 } },
  { id: 49, name: "Test Case #49 (Husband 1, Daughter 1)", relatives: { husband: 1, daughters: 1 } },
  { id: 50, name: "Test Case #50 (Husband 1, Daughter 2)", relatives: { husband: 1, daughters: 2 } },
  { id: 51, name: "Test Case #51 (Husband 1, Son 1, Daughter 1)", relatives: { husband: 1, sons: 1, daughters: 1 } },
  { id: 52, name: "Test Case #52 (Husband 1, Son 2, Daughter 1)", relatives: { husband: 1, sons: 2, daughters: 1 } },
  { id: 53, name: "Test Case #53 (Husband 1, Son 1, Daughter 2)", relatives: { husband: 1, sons: 1, daughters: 2 } },
  { id: 54, name: "Test Case #54 (Husband 1, Father 1)", relatives: { husband: 1, father: 1 } },
  { id: 55, name: "Test Case #55 (Husband 1, Mother 1)", relatives: { husband: 1, mother: 1 } },
  { id: 56, name: "Test Case #56 (Husband 1, Father 1, Mother 1)", relatives: { husband: 1, father: 1, mother: 1 } },
  { id: 57, name: "Test Case #57 (Husband 1, Father 1, Mother 1, Son 1)", relatives: { husband: 1, father: 1, mother: 1, sons: 1 } },
  { id: 58, name: "Test Case #58 (Husband 1, Father 1, Mother 1, Daughter 1)", relatives: { husband: 1, father: 1, mother: 1, daughters: 1 } },
  { id: 59, name: "Test Case #59 (Husband 1, Father 1, Mother 1, Daughter 2)", relatives: { husband: 1, father: 1, mother: 1, daughters: 2 } },
  { id: 60, name: "Test Case #60 (Husband 1, Father 1, Mother 1, Son 1, Daughter 1)", relatives: { husband: 1, father: 1, mother: 1, sons: 1, daughters: 1 } },
  { id: 61, name: "Test Case #61 (Husband 1, Father 1, Mother 1, Son 2, Daughter 1)", relatives: { husband: 1, father: 1, mother: 1, sons: 2, daughters: 1 } },
  { id: 62, name: "Test Case #62 (Husband 1, Father 1, Mother 1, Son 1, Daughter 2)", relatives: { husband: 1, father: 1, mother: 1, sons: 1, daughters: 2 } },
  { id: 63, name: "Test Case #63 (Husband 1, Father 1, Mother 1, Son 2, Daughter 2)", relatives: { husband: 1, father: 1, mother: 1, sons: 2, daughters: 2 } },
  { id: 64, name: "Test Case #64 (Wife 4, Father 1, Mother 1, Son 3, Daughter 2)", relatives: { wives: 4, father: 1, mother: 1, sons: 3, daughters: 2 } },
  { id: 65, name: "Test Case #65 (Husband 1, Father 1, Mother 1, Son 3, Daughter 2)", relatives: { husband: 1, father: 1, mother: 1, sons: 3, daughters: 2 } },
  { id: 66, name: "Test Case #66 (Wife 2, Father 1, Mother 1, Son 1, Daughter 3)", relatives: { wives: 2, father: 1, mother: 1, sons: 1, daughters: 3 } },
  { id: 67, name: "Test Case #67 (Husband 1, Father 1, Mother 1, Son 1, Daughter 3)", relatives: { husband: 1, father: 1, mother: 1, sons: 1, daughters: 3 } },
  { id: 68, name: "Test Case #68 (Wife 3, Father 1, Mother 1, Son 2, Daughter 3)", relatives: { wives: 3, father: 1, mother: 1, sons: 2, daughters: 3 } },
  { id: 69, name: "Test Case #69 (Husband 1, Father 1, Mother 1, Son 2, Daughter 3)", relatives: { husband: 1, father: 1, mother: 1, sons: 2, daughters: 3 } },
  { id: 70, name: "Test Case #70 (Wife 4, Father 1, Mother 1, Son 4, Daughter 4)", relatives: { wives: 4, father: 1, mother: 1, sons: 4, daughters: 4 } },
  { id: 71, name: "Test Case #71 (1 Son)", relatives: { sons: 1 } },
  { id: 72, name: "Test Case #72 (1 Father)", relatives: { father: 1 } },
  { id: 73, name: "Test Case #73 (Umar's Case: Wife, Father, Mother)", relatives: { wives: 1, father: 1, mother: 1 } },
  { id: 74, name: "Test Case #74 (Umar's Case: Husband, Father, Mother)", relatives: { husband: 1, father: 1, mother: 1 } },
];

function gcd(a: number, b: number): number {
  a = Math.abs(a)
  b = Math.abs(b)
  return b === 0 ? a : gcd(b, a % b)
}

function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return 0
  return Math.abs(a * b) / gcd(a, b)
}

function lcmList(numbers: number[]): number {
  return numbers.reduce((acc, num) => lcm(acc, num), 1)
}

function simplifyFraction(numerator: number, denominator: number) {
  if (numerator === 0) {
    return { numerator: 0, denominator: 1 };
  }
  const divisor = gcd(numerator, denominator);
  return { numerator: numerator / divisor, denominator: denominator / divisor };
}

function fractionToString(numerator: number, denominator: number) {
  const simplified = simplifyFraction(numerator, denominator);
  return simplified.denominator === 1 ? `${simplified.numerator}` : `${simplified.numerator}/${simplified.denominator}`;
}

function addFractions(left: [number, number], right: [number, number]): [number, number] {
  const [leftNum, leftDen] = left;
  const [rightNum, rightDen] = right;
  const simplified = simplifyFraction(leftNum * rightDen + rightNum * leftDen, leftDen * rightDen);
  return [simplified.numerator, simplified.denominator];
}

function multiplyFractions(left: [number, number], right: [number, number]): [number, number] {
  const [leftNum, leftDen] = left;
  const [rightNum, rightDen] = right;
  const simplified = simplifyFraction(leftNum * rightNum, leftDen * rightDen);
  return [simplified.numerator, simplified.denominator];
}

function fractionToPercentage(numerator: number, denominator: number): string {
  const percentage = (numerator / denominator) * 100
  return percentage % 1 === 0 ? `${percentage}%` : `${percentage.toFixed(2)}%`
}

function calculateInheritance(relatives: any) {
  const shares: {[key: string]: { numerator: number; denominator: number }} = {};
  const calculationSteps: string[] = [];
  const hasChildren = relatives.sons > 0 || relatives.daughters > 0;
  const fixedShares: [number, number][] = [];
  let fixedShareTotal: [number, number] = [0, 1];

  const pushFixedShare = (numerator: number, denominator: number) => {
    fixedShares.push([numerator, denominator]);
  };

  // 1. Spouses (Dhawu al-Furud)
  if (relatives.husband > 0) {
    const husbandShare: [number, number] = hasChildren ? [1, 4] : [1, 2];
    shares.husband = { numerator: husbandShare[0], denominator: husbandShare[1] };
    pushFixedShare(husbandShare[0], husbandShare[1]);
    calculationSteps.push(`Husband gets prescribed share of ${fractionToString(husbandShare[0], husbandShare[1])} (Qur'an 4:12)`);
  }
  if (relatives.wives > 0) {
    const collectiveWifeShare: [number, number] = hasChildren ? [1, 8] : [1, 4];
    // Store COLLECTIVE share first for Radd
    shares.wives = { numerator: collectiveWifeShare[0], denominator: collectiveWifeShare[1] }; 
    pushFixedShare(collectiveWifeShare[0], collectiveWifeShare[1]);
    calculationSteps.push(`Wives collectively get prescribed share of ${fractionToString(collectiveWifeShare[0], collectiveWifeShare[1])} (Qur'an 4:12)`);
  }

  // 2. Parents (Dhawu al-Furud)
  if (relatives.father > 0) {
    const fatherFixedShare: [number, number] = [1, 6];
    shares.father = { numerator: fatherFixedShare[0], denominator: fatherFixedShare[1] };
    pushFixedShare(fatherFixedShare[0], fatherFixedShare[1]);
    calculationSteps.push(`Father gets prescribed share of 1/6 (Qur'an 4:11)`);
  }
  if (relatives.mother > 0) {
    const motherShare: [number, number] = hasChildren ? [1, 6] : [1, 3];
    shares.mother = { numerator: motherShare[0], denominator: motherShare[1] };
    pushFixedShare(motherShare[0], motherShare[1]);
    calculationSteps.push(`Mother gets prescribed share of ${fractionToString(motherShare[0], motherShare[1])} (Qur'an 4:11)`);
  }

  // 3. Daughters (Dhawu al-Furud if no sons)
  if (relatives.sons === 0 && relatives.daughters > 0) {
    const collectiveDaughterShare: [number, number] = relatives.daughters === 1 ? [1, 2] : [2, 3];
    // Store COLLECTIVE share first for Radd
    shares.daughters = { numerator: collectiveDaughterShare[0], denominator: collectiveDaughterShare[1] }; 
    pushFixedShare(collectiveDaughterShare[0], collectiveDaughterShare[1]);
    calculationSteps.push(`${relatives.daughters === 1 ? 'Daughter gets' : 'Daughters collectively get'} prescribed share of ${fractionToString(collectiveDaughterShare[0], collectiveDaughterShare[1])} (Qur'an 4:11)`);
  }

  // Check if Umar's case applies: only spouse(s), father, mother; no children/siblings!
  const isUmarCase = 
    (relatives.husband > 0 || relatives.wives > 0) && 
    relatives.father === 1 && 
    relatives.mother === 1 && 
    !hasChildren;

  let applyUmarCase = false;
  
  if (isUmarCase) {
    calculationSteps.push(`Umar's case detected. Special rules need to be applied for parent's share calculation.`);
    applyUmarCase = true;
    
    // Spouse gets prescribed share as normal
    // Now reset father and mother shares to zero, we will calculate them based on remainder
    delete shares.father;
    delete shares.mother;
    
    // Recalculate fixedShareTotal (only spouse)
    fixedShareTotal = [0, 1];
    if (shares.husband) fixedShareTotal = addFractions(fixedShareTotal, [shares.husband.numerator, shares.husband.denominator]);
    if (shares.wives) fixedShareTotal = addFractions(fixedShareTotal, [1, hasChildren ? 8 : 4]);
  }
  else {
    // Normal case: calculate total fixed shares (all fixed)
    fixedShareTotal = fixedShares.reduce<[number, number]>(
      (total, share) => addFractions(total, share),
      [0, 1]
    );
  }

  // Check for Awal (Total > 1)
  if (!applyUmarCase && fixedShareTotal[0] > fixedShareTotal[1]) {
    const awalNumerator = fixedShareTotal[0];
    calculationSteps.push(`Total shares (${fixedShareTotal[0]}/${fixedShareTotal[1]}) exceed 1. Applying Awal (proportional reduction) by increasing denominator to ${awalNumerator}.`);
    const adjustShare = (s: { numerator: number; denominator: number }) => {
      const common = simplifyFraction(s.numerator * fixedShareTotal[1], s.denominator * awalNumerator);
      return common;
    };
    if (shares.husband) shares.husband = adjustShare(shares.husband);
    if (shares.wives) shares.wives = adjustShare(shares.wives);
    if (shares.father) shares.father = adjustShare(shares.father);
    if (shares.mother) shares.mother = adjustShare(shares.mother);
    if (shares.daughters) shares.daughters = adjustShare(shares.daughters);
    fixedShareTotal = [1, 1];
  }

  // 4. Residual (Asaba) and Radd (Return) and Umar's case
  const remainingShare = simplifyFraction(fixedShareTotal[1] - fixedShareTotal[0], fixedShareTotal[1]);
  if (remainingShare.numerator > 0) {
    calculationSteps.push(`Remaining share after fixed allocations: ${fractionToString(remainingShare.numerator, remainingShare.denominator)}`);
    
    if (applyUmarCase) {
      // Umar's case: split remainder 2:1 father : mother
      const fatherShare = simplifyFraction(remainingShare.numerator * 2, remainingShare.denominator * 3);
      const motherShare = simplifyFraction(remainingShare.numerator, remainingShare.denominator * 3);
      shares.father = fatherShare;
      shares.mother = motherShare;
      calculationSteps.push(`Father gets the share of ${fractionToString(fatherShare.numerator, fatherShare.denominator)} and Mother gets the share of ${fractionToString(motherShare.numerator, motherShare.denominator)}`);
    } else if (relatives.sons > 0) {
      const totalUnits = relatives.sons * 2 + relatives.daughters;
      const individualSonShare = simplifyFraction(remainingShare.numerator * 2, remainingShare.denominator * totalUnits);
      const individualDaughterShare = simplifyFraction(remainingShare.numerator, remainingShare.denominator * totalUnits);
      shares.sons = individualSonShare;
      shares.daughters = individualDaughterShare;
      calculationSteps.push(`Sons and Daughters share the remainder as Asaba (2:1 ratio). Each son gets ${fractionToString(individualSonShare.numerator, individualSonShare.denominator)} and each daughter gets ${fractionToString(individualDaughterShare.numerator, individualDaughterShare.denominator)}`);
    } else if (relatives.father > 0) {
      const fatherFixed = shares.father;
      const newFatherShare = addFractions([fatherFixed.numerator, fatherFixed.denominator], [remainingShare.numerator, remainingShare.denominator]);
      shares.father = { numerator: newFatherShare[0], denominator: newFatherShare[1] };
      calculationSteps.push(`Father takes the remaining ${fractionToString(remainingShare.numerator, remainingShare.denominator)} as Asaba.`);
    } else {
      // Radd (Return) case
      // Check which non-spouse heirs are present first
      const nonSpouseHeirs: Array<{ key: string; numerator: number; denominator: number }> = [];
      if (shares.father) nonSpouseHeirs.push({ key: 'father', ...shares.father });
      if (shares.mother) nonSpouseHeirs.push({ key: 'mother', ...shares.mother });
      if (shares.daughters) nonSpouseHeirs.push({ key: 'daughters', ...shares.daughters });

      if (nonSpouseHeirs.length > 0) {
        // Total of non-spouse shares (original fixed shares)
        let nonSpouseTotal: [number, number] = [0, 1];
        nonSpouseHeirs.forEach(heir => {
          nonSpouseTotal = addFractions(nonSpouseTotal, [heir.numerator, heir.denominator]);
        });
        
        // Calculate total spouse share (stays fixed)
        let spouseTotal: [number, number] = [0, 1];
        if (shares.husband) spouseTotal = [shares.husband.numerator, shares.husband.denominator];
        if (shares.wives) spouseTotal = [shares.wives.numerator, shares.wives.denominator];
        
        calculationSteps.push(`Applying Radd (Return): remaining share is distributed proportionately among non-spouse fixed sharers.`);
        // Correct formula for Radd: new_i = original_i * ( (1 - spouseTotal) / nonSpouseTotal )
        // Because spouse's share stays fixed, so 1 - spouseTotal is what non-spouses divide
        const numeratorPart: [number, number] = [1, 1]; // 1
        const numeratorPartMinusSpouse: [number, number] = addFractions(numeratorPart, [-spouseTotal[0], spouseTotal[1]]); // 1 - spouseTotal
        const multiplier: [number, number] = [numeratorPartMinusSpouse[0] * nonSpouseTotal[1], numeratorPartMinusSpouse[1] * nonSpouseTotal[0]]; // (1-spouseTotal)/nonSpouseTotal
        
        nonSpouseHeirs.forEach(heir => {
          const heirOriginalShare: [number, number] = [heir.numerator, heir.denominator];
          const newHeirShare = multiplyFractions(heirOriginalShare, multiplier);
          shares[heir.key] = { numerator: newHeirShare[0], denominator: newHeirShare[1] };
        });
      } else {
        // Only spouse(s) are present
        calculationSteps.push(`Only spouse(s) present and no other heirs. Spouse(s) get the full share.`);
        if (shares.husband) {
          shares.husband = { numerator: 1, denominator: 1 };
        }
        if (shares.wives) {
          const eachWifeShare = simplifyFraction(1, relatives.wives);
          shares.wives = eachWifeShare;
        }
      }
    }
  }
  
  // Split collective shares into individual (for daughters and wives)
  if (relatives.wives > 0 && shares.wives) {
    const collectiveWifeShare = shares.wives;
    const individualWifeShare = simplifyFraction(collectiveWifeShare.numerator, collectiveWifeShare.denominator * relatives.wives);
    shares.wives = individualWifeShare;
  }
  if (relatives.daughters > 0 && shares.daughters) {
    const collectiveDaughterShare = shares.daughters;
    const individualDaughterShare = simplifyFraction(collectiveDaughterShare.numerator, collectiveDaughterShare.denominator * relatives.daughters);
    shares.daughters = individualDaughterShare;
  }

  // Build individual shares list
  const byIndividual: any[] = [];
  if (relatives.husband > 0 && shares.husband) {
    byIndividual.push({ name: 'Husband', numerator: shares.husband.numerator, denominator: shares.husband.denominator });
  }
  if (relatives.wives > 0 && shares.wives) {
    if (relatives.wives === 1) {
      byIndividual.push({ name: 'Wife', numerator: shares.wives.numerator, denominator: shares.wives.denominator });
    } else {
      for (let i = 1; i <= relatives.wives; i++) {
        byIndividual.push({ name: `Wife ${i}`, numerator: shares.wives.numerator, denominator: shares.wives.denominator });
      }
    }
  }
  if (relatives.sons > 0 && shares.sons) {
    if (relatives.sons === 1) {
      byIndividual.push({ name: 'Son', numerator: shares.sons.numerator, denominator: shares.sons.denominator });
    } else {
      for (let i = 1; i <= relatives.sons; i++) {
        byIndividual.push({ name: `Son ${i}`, numerator: shares.sons.numerator, denominator: shares.sons.denominator });
      }
    }
  }
  if (relatives.daughters > 0 && shares.daughters) {
    if (relatives.daughters === 1) {
      byIndividual.push({ name: 'Daughter', numerator: shares.daughters.numerator, denominator: shares.daughters.denominator });
    } else {
      for (let i = 1; i <= relatives.daughters; i++) {
        byIndividual.push({ name: `Daughter ${i}`, numerator: shares.daughters.numerator, denominator: shares.daughters.denominator });
      }
    }
  }
  if (relatives.father > 0 && shares.father) {
    byIndividual.push({ name: 'Father', numerator: shares.father.numerator, denominator: shares.father.denominator });
  }
  if (relatives.mother > 0 && shares.mother) {
    byIndividual.push({ name: 'Mother', numerator: shares.mother.numerator, denominator: shares.mother.denominator });
  }

  // Calculate common denominator
  const denominators = byIndividual.map(s => s.denominator);
  const commonDenominator = lcmList(denominators);

  return {
    shares: shares,
    individualShares: byIndividual,
    commonDenominator: commonDenominator,
    calculationSteps: calculationSteps
  };
}

export default function ResultsPage() {
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    // First check for ID query param for test case
    const idParam = searchParams.get('ID');
    if (idParam) {
      const testCaseId = parseInt(idParam);
      const foundTestCase = testCases.find(tc => tc.id === testCaseId);
      if (foundTestCase) {
        const baseRelatives = {
          husband: 0,
          wives: 0,
          sons: 0,
          daughters: 0,
          grandsons: 0,
          granddaughters: 0,
          father: 0,
          mother: 0,
          grandfather: 0,
          paternal_grandmother: 0,
          maternal_grandmother: 0,
          full_brothers: 0,
          full_sisters: 0,
          paternal_brothers: 0,
          paternal_sisters: 0,
          maternal_brothers: 0,
          maternal_sisters: 0,
          full_nephews: 0,
          paternal_nephews: 0,
          full_nephew_sons: 0,
          paternal_nephew_sons: 0,
          full_uncles: 0,
          paternal_uncles: 0,
          full_cousins: 0,
          paternal_cousins: 0,
          full_cousin_sons: 0,
          paternal_cousin_sons: 0,
          full_cousin_grandsons: 0,
          paternal_cousin_grandsons: 0,
        };
        const testRelatives = { ...baseRelatives, ...foundTestCase.relatives };
        const calculatedResults = calculateInheritance(testRelatives);
        setResults(calculatedResults);
        setError(null);
        return;
      }
    }

    // If no ID, check localStorage
    const storedResults = localStorage.getItem('inheritanceResults')
    if (storedResults) {
      setResults(JSON.parse(storedResults))
    } else {
      setError('No results found. Please calculate inheritance first.')
    }
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">II</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">Islamic Inheritance Calculator</h1>
            </div>
            <nav className="flex gap-4">
              <Link 
                href="/"
                className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Home
              </Link>
              <Link 
                href="/#rules"
                className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Rules
              </Link>
              <Link 
                href="/#test-cases"
                className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Test Cases
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Inheritance Distribution Results
          </h2>
          <p className="text-gray-600">
            According to the Qur'an and authentic Sunnah
          </p>
        </div>

        {error && (
          <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 font-medium">{error}</p>
            <Link 
              href="/"
              className="mt-4 inline-block px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Go to Calculator
            </Link>
          </div>
        )}

        {results && (
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Results Display */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Shares by Individual */}
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 md:col-span-2">
                <h3 className="text-xl font-bold text-emerald-700 mb-4">Shares by Individual</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-emerald-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-emerald-900">
                          Relative
                        </th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-emerald-900">
                          Share (Common Denominator)
                        </th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-emerald-900">
                          Share (Simplified)
                        </th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-emerald-900">
                          Percentage
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {results.individualShares?.map((individual: any, index: number) => {
                        const commonNumerator = (individual.numerator * results.commonDenominator) / individual.denominator;
                        const simplifiedNumerator = individual.numerator;
                        const simplifiedDenominator = individual.denominator;
                        const simplified = `${simplifiedNumerator}/${simplifiedDenominator}`;
                        const common = `${commonNumerator}/${results.commonDenominator}`;
                        const percentage = fractionToPercentage(individual.numerator, individual.denominator);
                        
                        return (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-900">{individual.name}</td>
                            <td className="px-4 py-3 text-center text-orange-600 font-medium">{common}</td>
                            <td className="px-4 py-3 text-center text-blue-600 font-medium">{simplified}</td>
                            <td className="px-4 py-3 text-center text-purple-600 font-medium">{percentage}</td>
                          </tr>
                        )
                      })}
                      {/* Sum Row */}
                      <tr className="bg-emerald-50 font-bold">
                        <td className="px-4 py-3 text-left text-emerald-900">Total</td>
                        <td className="px-4 py-3 text-center text-orange-700">{results.commonDenominator}/{results.commonDenominator}</td>
                        <td className="px-4 py-3 text-center text-blue-700">1/1</td>
                        <td className="px-4 py-3 text-center text-purple-700">100.00%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Calculation Steps */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-emerald-700 mb-4">Calculation Steps</h3>
              <div className="bg-gray-50 rounded-lg p-4 text-gray-700">
                <ol className="list-decimal list-inside space-y-2">
                  {Array.isArray(results.calculationSteps) ? (
                    results.calculationSteps.map((step: string, index: number) => (
                      <li key={index} className="pl-2">{step}</li>
                    ))
                  ) : (
                    <li className="pl-2">{results.calculationSteps}</li>
                  )}
                </ol>
              </div>
            </div>

            {/* Back Button */}
            <div className="text-center">
              <Link 
                href="/"
                className="inline-flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all font-medium shadow-md"
              >
                ← Back to Calculator
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
