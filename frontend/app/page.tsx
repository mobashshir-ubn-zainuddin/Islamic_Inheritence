'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Book, MessageCircle, Scale, BookOpen, Gift, Mail } from 'lucide-react';
import { Header } from './components/Header';

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

export default function Home() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState('calculator');
  const [lang, setLang] = useState<'en' | 'ur'>('en');
  const [estateValue, setEstateValue] = useState<number>(0);
  const [relatives, setRelatives] = useState<{[key: string]: number}>({
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
  });
  const [results, setResults] = useState<{
    byCategory: {[key: string]: string};
    byIndividual: {[key: string]: string};
    calculationSteps: string[];
  } | null>(null);
  const [calculationError, setCalculationError] = useState<string | null>(null);

  // Load test case from URL params if present
  useEffect(() => {
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
        setRelatives({ ...baseRelatives, ...foundTestCase.relatives });
        setActiveTab('calculator');
      }
    }
  }, [searchParams]);

  const gcd = (a: number, b: number): number => {
    const left = Math.abs(a);
    const right = Math.abs(b);
    return right === 0 ? left : gcd(right, left % right);
  };

  const lcm = (a: number, b: number): number => {
    if (a === 0 || b === 0) return 0;
    return Math.abs(a * b) / gcd(a, b);
  };

  const lcmList = (numbers: number[]): number => {
    return numbers.reduce((acc, num) => lcm(acc, num), 1);
  };

  const simplifyFraction = (numerator: number, denominator: number) => {
    if (numerator === 0) {
      return { numerator: 0, denominator: 1 };
    }

    const divisor = gcd(numerator, denominator);
    return {
      numerator: numerator / divisor,
      denominator: denominator / divisor,
    };
  };

  const fractionToString = (numerator: number, denominator: number) => {
    const simplified = simplifyFraction(numerator, denominator);
    return simplified.denominator === 1
      ? `${simplified.numerator}`
      : `${simplified.numerator}/${simplified.denominator}`;
  };

  const fractionToPercentage = (numerator: number, denominator: number): string => {
    const percentage = (numerator / denominator) * 100;
    return percentage % 1 === 0 ? `${percentage}%` : `${percentage.toFixed(2)}%`;
  };

  const addFractions = (left: [number, number], right: [number, number]): [number, number] => {
    const [leftNumerator, leftDenominator] = left;
    const [rightNumerator, rightDenominator] = right;
    const simplified = simplifyFraction(
      leftNumerator * rightDenominator + rightNumerator * leftDenominator,
      leftDenominator * rightDenominator
    );

    return [simplified.numerator, simplified.denominator];
  };

  const multiplyFractions = (left: [number, number], right: [number, number]): [number, number] => {
    const [leftNumerator, leftDenominator] = left;
    const [rightNumerator, rightDenominator] = right;
    const simplified = simplifyFraction(
      leftNumerator * rightNumerator,
      leftDenominator * rightDenominator
    );
    return [simplified.numerator, simplified.denominator];
  };
  
  // Calculate inheritance shares based on Hanafi Islamic law
  const calculateInheritance = () => {
    if (relatives.husband > 1) {
      setResults(null);
      setCalculationError('Invalid case: husband cannot be more than 1.');
      return;
    }

    if (relatives.husband > 0 && relatives.wives > 0) {
      setResults(null);
      setCalculationError('Invalid case: husband and wives cannot both be present. They represent different genders of the deceased.');
      return;
    }

    if (relatives.wives > 4) {
      setResults(null);
      setCalculationError('Invalid case: wives cannot be more than 4.');
      return;
    }

    if (relatives.father > 1) {
      setResults(null);
      setCalculationError('Invalid case: father cannot be more than 1.');
      return;
    }

    if (relatives.mother > 1) {
      setResults(null);
      setCalculationError('Invalid case: mother cannot be more than 1.');
      return;
    }

    setCalculationError(null);
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
      // Father always gets at least 1/6 if children exist
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

    // 4. Other Fixed Shares (Grandparents)
    if (relatives.grandfather > 0 && relatives.father === 0) {
      const grandfatherShare: [number, number] = [1, 6];
      shares.grandfather = { numerator: grandfatherShare[0], denominator: grandfatherShare[1] };
      pushFixedShare(grandfatherShare[0], grandfatherShare[1]);
      calculationSteps.push(`Grandfather gets prescribed share of 1/6 (father is absent)`);
    }

    if (relatives.paternal_grandmother > 0 || relatives.maternal_grandmother > 0) {
      const numGrandmothers = (relatives.paternal_grandmother > 0 ? 1 : 0) + (relatives.maternal_grandmother > 0 ? 1 : 0);
      const collectiveGrandmotherShare: [number, number] = [1, 6];
      const individualGrandmotherShare = simplifyFraction(collectiveGrandmotherShare[0], collectiveGrandmotherShare[1] * numGrandmothers);
      
      if (relatives.paternal_grandmother > 0) shares.paternal_grandmother = individualGrandmotherShare;
      if (relatives.maternal_grandmother > 0) shares.maternal_grandmother = individualGrandmotherShare;
      
      pushFixedShare(collectiveGrandmotherShare[0], collectiveGrandmotherShare[1]);
      calculationSteps.push(`Grandmothers collectively get prescribed share of 1/6, so each gets ${fractionToString(individualGrandmotherShare.numerator, individualGrandmotherShare.denominator)}`);
    }

    // Check if Umar's case applies: only spouse(s), father, mother; no children/siblings!
    const isUmarCase = 
      (relatives.husband > 0 || relatives.wives > 0) && 
      relatives.father === 1 && 
      relatives.mother === 1 && 
      !hasChildren && 
      relatives.full_brothers === 0 && 
      relatives.full_sisters === 0 && 
      relatives.paternal_brothers === 0 && 
      relatives.paternal_sisters === 0 && 
      relatives.maternal_brothers === 0 && 
      relatives.maternal_sisters === 0;
    
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
      
      // Adjust all fixed shares
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
        // Sons and Daughters as Asaba (2:1)
        const totalUnits = relatives.sons * 2 + relatives.daughters;
        const individualSonShare = simplifyFraction(remainingShare.numerator * 2, remainingShare.denominator * totalUnits);
        const individualDaughterShare = simplifyFraction(remainingShare.numerator, remainingShare.denominator * totalUnits);
        
        shares.sons = individualSonShare;
         shares.daughters = individualDaughterShare;
         calculationSteps.push(`Sons and Daughters share the remainder as Asaba (2:1 ratio). Each son gets ${fractionToString(individualSonShare.numerator, individualSonShare.denominator)} and each daughter gets ${fractionToString(individualDaughterShare.numerator, individualDaughterShare.denominator)}`);
      } else if (relatives.father > 0) {
        // Father takes remainder as Asaba
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
        if (shares.grandfather) nonSpouseHeirs.push({ key: 'grandfather', ...shares.grandfather });
        if (shares.paternal_grandmother) nonSpouseHeirs.push({ key: 'paternal_grandmother', ...shares.paternal_grandmother });
        if (shares.maternal_grandmother) nonSpouseHeirs.push({ key: 'maternal_grandmother', ...shares.maternal_grandmother });

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

    if (relatives.brothers > 0) {
      // Skip for now
    }
    if (relatives.sisters > 0) {
      // Skip for now
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
    
    // Build individual shares
    const byIndividual: {name: string; numerator: number; denominator: number}[] = [];
    
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
    
    if (relatives.grandfather > 0 && shares.grandfather) {
      byIndividual.push({ name: 'Grandfather', numerator: shares.grandfather.numerator, denominator: shares.grandfather.denominator });
    }
    
    if (relatives.paternal_grandmother > 0 && shares.paternal_grandmother) {
      byIndividual.push({ name: 'Paternal Grandmother', numerator: shares.paternal_grandmother.numerator, denominator: shares.paternal_grandmother.denominator });
    }
    
    if (relatives.maternal_grandmother > 0 && shares.maternal_grandmother) {
      byIndividual.push({ name: 'Maternal Grandmother', numerator: shares.maternal_grandmother.numerator, denominator: shares.maternal_grandmother.denominator });
    }
    
    // Collect denominators and calculate common denominator
    const denominators = byIndividual.map(s => s.denominator);
    const commonDenominator = lcmList(denominators);

    const finalResults = {
      shares: shares,
      individualShares: byIndividual,
      commonDenominator: commonDenominator,
      calculationSteps: calculationSteps
    };
    
    // Save to localStorage
    localStorage.setItem('inheritanceResults', JSON.stringify(finalResults));
    
    // Navigate to results page
    router.push('/results');
  };

  const handleRelativeChange = (key: string, count: number) => {
    setRelatives({...relatives, [key]: Math.max(0, count)});
    setResults(null);
    setCalculationError(null);
  };

  const t = {
    en: {
      title: 'Islamic Inheritance Calculator',
      subtitle: 'Hanafi Fiqh-based Inheritance Distribution',
      tabs: {
        calculator: 'Calculator',
        fatwas: 'Fatwas',
        chatbot: 'Chatbot',
        rules: 'Rules',
        testCases: 'Test Cases',
        books: 'Books',
        contact: 'Contact',
      },
      calculator: {
        title: 'Inheritance Calculator',
        desc: 'Enter the surviving relatives to calculate inheritance shares',
        estate: 'Estate Value',
        relatives: 'Surviving Relatives',
        husband: 'Husband',
        husbandDesc: 'Must be legally married.',
        wives: 'Wives',
        wivesDesc: 'Multiple wives are eligible.',
        sons: 'Sons',
        sonsDesc: 'Adopted son, step-son, or illegitimate son is not eligible.',
        daughters: 'Daughters',
        daughtersDesc: 'Adopted daughter, step-daughter, or illegitimate daughter is not eligible.',
        grandsons: 'Grandsons',
        grandsonsDesc: 'Only son\'s sons are eligible. Daughter\'s sons are not eligible.',
        granddaughters: 'Granddaughters',
        granddaughtersDesc: 'Only son\'s daughters are eligible. Daughter\'s daughters are not eligible.',
        father: 'Father',
        fatherDesc: 'Illegitimate father, or step-father is not eligible.',
        mother: 'Mother',
        motherDesc: 'Illegitimate mother, or step-mother is not eligible.',
        grandfather: 'Grandfather',
        grandfatherDesc: 'Only father\'s father is eligible. Mother\'s father is not eligible.',
        paternal_grandmother: 'Paternal Grandmother',
        paternal_grandmotherDesc: 'Father\'s mother is eligible.',
        maternal_grandmother: 'Maternal Grandmother',
        maternal_grandmotherDesc: 'Mother\'s mother is eligible.',
        full_brothers: 'Full Brothers',
        full_brothersDesc: 'Brothers who share the same father and the mother with the deceased.',
        full_sisters: 'Full Sisters',
        full_sistersDesc: 'Sisters who share the same father and the mother with the deceased.',
        paternal_brothers: 'Paternal Brothers',
        paternal_brothersDesc: 'Brothers who share the same father, but a different mother.',
        paternal_sisters: 'Paternal Sisters',
        paternal_sistersDesc: 'Sisters who share the same father, but a different mother.',
        maternal_brothers: 'Maternal Brothers',
        maternal_brothersDesc: 'Brothers who share the same mother, but a different father.',
        maternal_sisters: 'Maternal Sisters',
        maternal_sistersDesc: 'Sisters who share the same mother, but a different father.',
        full_nephews: 'Full Nephews',
        full_nephewsDesc: 'Only brother\'s sons are eligible. Sister\'s sons are not eligible.',
        paternal_nephews: 'Paternal Nephews',
        paternal_nephewsDesc: 'Only paternal brother\'s sons are eligible. Paternal brother\'s daughters are not eligible.',
        full_nephew_sons: 'Full Nephew\'s Sons',
        full_nephew_sonsDesc: 'Full brother\'s son\'s son.',
        paternal_nephew_sons: 'Paternal Nephew\'s Sons',
        paternal_nephew_sonsDesc: 'Paternal brother\'s son\'s son.',
        full_uncles: 'Full Uncles',
        full_unclesDesc: 'Father\'s full brother.',
        paternal_uncles: 'Paternal Uncles',
        paternal_unclesDesc: 'Father\'s paternal brother.',
        full_cousins: 'Full Cousins',
        full_cousinsDesc: 'Father\'s full brother\'s son.',
        paternal_cousins: 'Paternal Cousins',
        paternal_cousinsDesc: 'Father\'s paternal brother\'s son.',
        full_cousin_sons: 'Full Cousin\'s Sons',
        full_cousin_sonsDesc: 'Father\'s full brother\'s son\'s son.',
        paternal_cousin_sons: 'Paternal Cousin\'s Sons',
        paternal_cousin_sonsDesc: 'Father\'s paternal brother\'s son\'s son.',
        full_cousin_grandsons: 'Full Cousin\'s Grandsons',
        full_cousin_grandsonsDesc: 'Father\'s full brother\'s son\'s son\'s son.',
        paternal_cousin_grandsons: 'Paternal Cousin\'s Grandsons',
        paternal_cousin_grandsonsDesc: 'Father\'s paternal brother\'s son\'s son\'s son.',
        calculate: 'Calculate Inheritance',
        results: 'Inheritance Distribution Results',
      },
      fatwas: {
        title: 'Fatwa Search & References',
        desc: 'Search Islamic rulings from renowned Darul Iftas',
        references: 'Darul Ifta References',
        daruliftas: [
          { name: 'Darul Ifta Deoband (English)', url: 'https://darulifta-deoband.com/en' },
          { name: 'Darul Ifta Deoband (Urdu)', url: 'https://darulifta-deoband.com/' },
          { name: 'Darul Ifta Jamia Binoria (English)', url: 'https://www.onlinefatawa.com/EnglishFatwa' },
          { name: 'Darul Ifta Jamia Binoria (Urdu)', url: 'https://www.onlinefatawa.com/' },
          { name: 'Darul Ifta Jamia Darululoom Karachi', url: 'https://onlinedarulifta.com/' },
        ],
        askFatwa: 'Ask a Fatwa',
        searchPlaceholder: 'Search fatwas...',
      },
      chatbot: {
        title: 'Inheritance Scenarios Chatbot',
        desc: 'Learn about inheritance through interactive scenarios',
        scenario1: 'Simple Scenario',
        scenario2: 'Complex Case',
        message: 'Ask about inheritance scenarios...',
      },
      rules: {
        title: 'Rules of Inheritance',
        desc: 'Quranic and Hadith-based rules for Islamic inheritance',
        prescribed: 'Prescribed Shares',
        husband: 'Husband gets 1/4 (no children) or 1/2 (with children)',
        wife: 'Wife/Wives get 1/4 (no children) or 1/8 (with children)',
      },
      testCases: {
        title: 'Test Cases',
        desc: 'Study 22 comprehensive inheritance scenarios',
      },
      books: {
        title: 'Recommended Books',
        desc: 'Essential references on Islamic inheritance',
        books: [
          { name: 'Fiqh ul Inheritance - Classical Reference', url: '' },
          { name: 'Modern Islamic Law - Inheritance Section', url: '' },
          { name: 'As-Sirajiyyah (As Siraji fil Mirath) - English Translation', url: 'https://dn790007.ca.archive.org/0/items/AsSirajiyyahAsSirajiFilMirathEnglishTranslation/As-Sirajiyyah%20%28As%20Siraji%20fil%20Mirath%29%20-%20English%20Translation.pdf' }
        ],
      },
    },
    ur: {
      title: 'اسلامی وراثت کا کیلکولیٹر',
      subtitle: 'حنفی فقہ کی بنیاد پر وراثت کی تقسیم',
      tabs: {
        calculator: 'کیلکولیٹر',
        fatwas: 'فتاویٰ',
        chatbot: 'چیٹ بوٹ',
        rules: 'قوانین',
        testCases: 'ٹیسٹ کیسز',
        books: 'کتابیں',
        contact: 'رابطہ',
      },
      calculator: {
        title: 'وراثت کیلکولیٹر',
        desc: 'وراثت کے حصوں کا حساب لگانے کے لئے زندہ رشتہ دار درج کریں',
        estate: 'ترکہ کی رقم',
        relatives: 'زندہ رشتہ دار',
        husband: 'شوہر',
        husbandDesc: 'قانونی شادی ہونی ضروری ہے۔',
        wives: 'بیویاں',
        wivesDesc: 'ایک سے زیادہ بیویاں اہل ہیں۔',
        sons: 'بیٹے',
        sonsDesc: 'منتخب بیٹا، سوتیلا بیٹا، یا ناجائز بیٹا اہل نہیں ہے۔',
        daughters: 'بیٹیاں',
        daughtersDesc: 'منتخب بیٹی، سوتیلی بیٹی، یا ناجائز بیٹی اہل نہیں ہے۔',
        grandsons: 'پوتے',
        grandsonsDesc: 'صرف بیٹے کے بیٹے اہل ہیں۔ بیٹی کے بیٹے اہل نہیں ہیں۔',
        granddaughters: 'پوتیاں',
        granddaughtersDesc: 'صرف بیٹے کی بیٹیاں اہل ہیں۔ بیٹی کی بیٹیاں اہل نہیں ہیں۔',
        father: 'والد',
        fatherDesc: 'ناجائز والد، یا سوتیلا والد اہل نہیں ہے۔',
        mother: 'والدہ',
        motherDesc: 'ناجائز والدہ، یا سوتیلی والدہ اہل نہیں ہے۔',
        grandfather: 'دادا',
        grandfatherDesc: 'صرف والد کے والد اہل ہیں۔ والدہ کے والد اہل نہیں ہیں۔',
        paternal_grandmother: 'دادی',
        paternal_grandmotherDesc: 'والد کی والدہ اہل ہیں۔',
        maternal_grandmother: 'نانی',
        maternal_grandmotherDesc: 'والدہ کی والدہ اہل ہیں۔',
        full_brothers: ' بھائی',
        full_brothersDesc: 'وہ بھائی جو میت کے ساتھ ایک والد اور ایک والدہ کے ہوں۔',
        full_sisters: ' بہنیں',
        full_sistersDesc: 'وہ بہنیں جو میت کے ساتھ ایک والد اور ایک والدہ کے ہوں۔',
        paternal_brothers: 'ابائی بھائی',
        paternal_brothersDesc: 'وہ بھائی جو ایک والد کے ہوں لیکن والدہ مختلف ہو۔',
        paternal_sisters: 'ابائی بہنیں',
        paternal_sistersDesc: 'وہ بہنیں جو ایک والد کے ہوں لیکن والدہ مختلف ہو۔',
        maternal_brothers: 'ممانی بھائی',
        maternal_brothersDesc: 'وہ بھائی جو ایک والدہ کے ہوں لیکن والد مختلف ہو۔',
        maternal_sisters: 'ممانی بہنیں',
        maternal_sistersDesc: 'وہ بہنیں جو ایک والدہ کے ہوں لیکن والد مختلف ہو۔',
        full_nephews: ' بھانجے',
        full_nephewsDesc: 'صرف بھائی کے بیٹے اہل ہیں۔ بہن کے بیٹے اہل نہیں ہیں۔',
        paternal_nephews: 'ابائی بھانجے',
        paternal_nephewsDesc: 'صرف ابائی بھائی کے بیٹے اہل ہیں۔ ابائی بھائی کی بیٹیاں اہل نہیں ہیں۔',
        full_nephew_sons: ' بھانجے کے بیٹے',
        full_nephew_sonsDesc: ' بھائی کے بیٹے کے بیٹے۔',
        paternal_nephew_sons: 'ابائی بھانجے کے بیٹے',
        paternal_nephew_sonsDesc: 'ابائی بھائی کے بیٹے کے بیٹے۔',
        full_uncles: ' چچا',
        full_unclesDesc: 'والد کے بھائی۔',
        paternal_uncles: 'ابائی چچا',
        paternal_unclesDesc: 'والد کے ابائی بھائی۔',
        full_cousins: ' بھانجے',
        full_cousinsDesc: 'والد کے بھائی کے بیٹے۔',
        paternal_cousins: 'ابائی بھانجے',
        paternal_cousinsDesc: 'والد کے ابائی بھائی کے بیٹے۔',
        full_cousin_sons: ' بھانجے کے بیٹے',
        full_cousin_sonsDesc: 'والد کے بھائی کے بیٹے کے بیٹے۔',
        paternal_cousin_sons: 'ابائی بھانجے کے بیٹے',
        paternal_cousin_sonsDesc: 'والد کے ابائی بھائی کے بیٹے کے بیٹے۔',
        full_cousin_grandsons: ' بھانجے کے پوتے',
        full_cousin_grandsonsDesc: 'والد کے بھائی کے بیٹے کے بیٹے کے بیٹے۔',
        paternal_cousin_grandsons: 'ابائی بھانجے کے پوتے',
        paternal_cousin_grandsonsDesc: 'والد کے ابائی بھائی کے بیٹے کے بیٹے کے بیٹے۔',
        calculate: 'وراثت کا حساب کریں',
        results: 'وراثت کی تقسیم کے نتائج',
      },
      fatwas: {
        title: 'فتویٰ تلاش اور حوالہ جات',
        desc: 'معروف دارالافتاء سے اسلامی احکام تلاش کریں',
        references: 'دارالافتاء حوالہ جات',
        daruliftas: [
          { name: 'دارالافتاء دیوبند (English)', url: 'https://darulifta-deoband.com/en' },
          { name: 'دارالافتاء دیوبند (Urdu)', url: 'https://darulifta-deoband.com/' },
          { name: 'دارالافتاء جامعہ بنوریہ (English)', url: 'https://www.onlinefatawa.com/EnglishFatwa' },
          { name: 'دارالافتاء جامعہ بنوریہ (Urdu)', url: 'https://www.onlinefatawa.com/' },
          { name: 'دارالافتاء جامعہ دارالعلوم کراچی', url: 'https://onlinedarulifta.com/' },
        ],
        askFatwa: 'فتویٰ پوچھیں',
        searchPlaceholder: 'فتاویٰ تلاش کریں...',
      },
      chatbot: {
        title: 'وراثت کے سوالات کا چیٹ بوٹ',
        desc: 'انٹرایکٹو مثالوں کے ذریعے وراثت سمجھیں',
        scenario1: 'سادہ مثال',
        scenario2: 'مشکل مثال',
        message: 'وراثت کے بارے میں پوچھیں...',
      },
      rules: {
        title: 'وراثت کے احکام',
        desc: 'قرآن و حدیث کی روشنی میں اسلامی وراثت کے اصول',
        prescribed: 'متعین حصے',
        husband: 'شوہر کو 1/4 (اولاد نہ ہو) یا 1/2 (اولاد ہو) ملتا ہے',
        wife: 'بیوی/بیویوں کو 1/4 (اولاد نہ ہو) یا 1/8 (اولاد ہو) ملتا ہے',
      },
      testCases: {
        title: 'ٹیسٹ کیسز',
        desc: 'وراثت کے 22 جامع مسائل کا مطالعہ کریں',
      },
      books: {
        title: 'تجویز کردہ کتابیں',
        desc: 'وراثت پر اہم مراجع',
        books: [
          { name: 'فقہ الوراثہ - کلاسیکی حوالہ', url: '' },
          { name: 'جدید اسلامی قانون - وراثت کا حصہ', url: '' },
          { name: 'السیراجیہ (السیراجی في المیراث) - انگریزی ترجمہ', url: 'https://dn790007.ca.archive.org/0/items/AsSirajiyyahAsSirajiFilMirathEnglishTranslation/As-Sirajiyyah%20%28As%20Siraji%20fil%20Mirath%29%20-%20English%20Translation.pdf' }
        ],
      },
    },
  };

  const text = t[lang as keyof typeof t] as typeof t.en;

  return (
    <div className="min-h-screen bg-islamic-pattern"
         style={{backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(15, 95, 95, 0.05) 0%, transparent 50%)'}}
    >
      <Header />
      <header className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="accent-text text-sm uppercase tracking-[0.24em]">{text.subtitle}</p>
            <h1 className="mt-2 text-3xl font-bold text-primary md:text-4xl">{text.title}</h1>
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-border bg-white/80 px-4 py-3 shadow-sm backdrop-blur">
            <span className="text-sm font-semibold text-muted">Language</span>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as 'en' | 'ur')}
              className="rounded-md border border-border bg-white px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Select language"
            >
              <option value="en">English</option>
              <option value="ur">اردو</option>
            </select>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto gap-2">
            {Object.entries(text.tabs).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-4 py-3 font-medium transition-colors whitespace-nowrap border-b-2 ${
                  activeTab === key
                    ? 'border-accent text-primary'
                    : 'border-transparent text-black hover:text-primary'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 flex-1">
        {/* Calculator Tab */}
        {activeTab === 'calculator' && (
          <section className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8 border border-border">
              <div className="flex items-center gap-3 mb-6">
                <Scale className="text-primary" size={32} />
                <div>
                  <h2 className="text-2xl font-bold text-primary">{text.calculator.title}</h2>
                  <p className="text-black">{text.calculator.desc}</p>
                </div>
              </div>

              <div className="max-w-2xl mx-auto">
                {/* Input Form */}
                <div className="space-y-6">
                  <div>
                    <label className="block font-semibold mb-2 text-black">{text.calculator.estate}</label>
                    <input 
                      type="number" 
                      placeholder="Enter estate value"
                      className="w-full px-4 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary text-black"
                    />
                  </div>

                  <div>
                    <h3 className="font-bold text-primary mb-4 text-black">{text.calculator.relatives}</h3>
                    {[
                      'husband',
                      'wives',
                      'sons',
                      'daughters',
                      'father',
                      'mother',
                      // 'full_brothers',
                      // 'full_sisters',
                      // 'paternal_brothers',
                      // 'paternal_sisters',
                      // 'maternal_brothers',
                      // 'maternal_sisters',
                      // 'grandsons',
                      // 'granddaughters',
                      // 'grandfather',
                      // 'paternal_grandmother',
                      // 'maternal_grandmother',
                      // 'full_nephews',
                      // 'paternal_nephews',
                      // 'full_nephew_sons',
                      // 'paternal_nephew_sons',
                      // 'full_uncles',
                      // 'paternal_uncles',
                      // 'full_cousins',
                      // 'paternal_cousins',
                      // 'full_cousin_sons',
                      // 'paternal_cousin_sons',
                      // 'full_cousin_grandsons',
                      // 'paternal_cousin_grandsons',
                    ].map(rel => (
                      <div key={rel} className="flex items-start gap-2 mb-3">
                        <div className="flex-1">
                          <label className="text-black font-semibold">{text.calculator[rel as keyof typeof text.calculator]}</label>
                          <p className="text-gray-600 text-sm mt-1">{text.calculator[`${rel}Desc` as keyof typeof text.calculator]}</p>
                        </div>
                        <input
                          type="number"
                          placeholder="Count"
                          min="0"
                          value={relatives[rel] || ''}
                          onChange={(e) => handleRelativeChange(rel, Number(e.target.value))}
                          className="w-16 px-2 py-1 border border-border rounded text-center text-black"
                        />
                      </div>
                    ))}
                  </div>

                  <button onClick={calculateInheritance} className="w-full primary-btn py-3 rounded font-semibold">
                    {text.calculator.calculate}
                  </button>
                  
                  {calculationError && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-600 font-medium">{calculationError}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Fatwas Tab */}
        {activeTab === 'fatwas' && (
          <section className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8 border border-border">
              <div className="flex items-center gap-3 mb-6">
                <Book className="text-primary" size={32} />
                <div>
                  <h2 className="text-2xl font-bold text-primary">{text.fatwas.title}</h2>
                  <p className="text-black">{text.fatwas.desc}</p>
                </div>
              </div>

              <input 
                type="text" 
                placeholder={text.fatwas.searchPlaceholder}
                className="w-full px-4 py-3 border border-border rounded mb-6 focus:outline-none focus:ring-2 focus:ring-primary"
              />

              <h3 className="text-lg font-bold text-primary mb-4 text-black">{text.fatwas.references}</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {text.fatwas.daruliftas.map((darul: (typeof text.fatwas.daruliftas)[number], idx: number) => (
                  <a
                    key={idx}
                    href={darul.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 border border-border rounded-lg hover:bg-primary/5 hover:border-primary transition-colors"
                  >
                    <p className="font-semibold text-primary hover:underline">{darul.name}</p>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Chatbot Tab */}
        {activeTab === 'chatbot' && (
          <section className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8 border border-border">
              <div className="flex items-center gap-3 mb-6">
                <MessageCircle className="text-primary" size={32} />
                <div>
                  <h2 className="text-2xl font-bold text-primary">{text.chatbot.title}</h2>
                  <p className="text-black">{text.chatbot.desc}</p>
                </div>
              </div>

              <div className="bg-gradient-to-b from-primary/5 to-transparent rounded-lg p-4 h-80 mb-4 border border-border overflow-y-auto">
                <p className="text-muted text-center py-20">Chat interface coming soon...</p>
              </div>

              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder={text.chatbot.message}
                  className="flex-1 px-4 py-3 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button className="primary-btn px-6 py-3 rounded font-semibold">Send</button>
              </div>
            </div>
          </section>
        )}

        {/* Rules Tab */}
        {activeTab === 'rules' && (
          <section className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8 border border-border">
              <div className="flex items-center gap-3 mb-6">
                <BookOpen className="text-primary" size={32} />
                <div>
                  <h2 className="text-2xl font-bold text-primary">{text.rules.title}</h2>
                  <p className="text-black">{text.rules.desc}</p>
                </div>
              </div>

              <div className="space-y-6 max-h-[72vh] overflow-y-auto pr-2">
                <section className="rounded-xl border border-border bg-accent/5 p-5">
                  <h3 className="text-lg font-bold text-primary mb-3">Prescribed Shares</h3>
                  <ol className="list-decimal list-inside space-y-3 text-sm leading-6 text-black">
                    <li className="rounded-lg border border-border bg-white/80 p-3">Husband [AnNisa 4:12] gets 1/2 if the deceased has no offspring, and 1/4 if the deceased has offspring.</li>
                    <li className="rounded-lg border border-border bg-white/80 p-3">Wife [AnNisa 4:12] is divided equally among all wives. Wives get 1/4 if the deceased has no offspring, and 1/8 if the deceased has offspring.</li>
                    <li className="rounded-lg border border-border bg-white/80 p-3">Daughter [AnNisa 4:11] gets 1/2 if there is only one daughter and no sons. Daughters get 2/3 if there are multiple daughters and no sons.</li>
                    <li className="rounded-lg border border-border bg-white/80 p-3">Granddaughter from son gets 1/2 if there is only one granddaughter from a son, no son, no daughter, and no grandson from a son. She gets 2/3 if there are multiple granddaughters from a son under the same conditions. She gets 1/6 if there is one daughter, no son, and no grandson from a son.</li>
                    <li className="rounded-lg border border-border bg-white/80 p-3">Father [AnNisa 4:11] gets 1/6 if the deceased has offspring.</li>
                    <li className="rounded-lg border border-border bg-white/80 p-3">Mother [AnNisa 4:11] gets 1/3 if the deceased has no offspring and no multiple siblings. She gets 1/6 if the deceased has offspring or multiple siblings.</li>
                    <li className="rounded-lg border border-border bg-white/80 p-3">Paternal grandfather gets 1/6 if there is no father and the deceased has offspring.</li>
                    <li className="rounded-lg border border-border bg-white/80 p-3">Paternal grandmother gets 1/6 if there is no mother, no father, and no maternal grandmother. She gets 1/12 if there is no mother, no father, and a maternal grandmother exists.</li>
                    <li className="rounded-lg border border-border bg-white/80 p-3">Maternal grandmother gets 1/6 if there is no mother. She gets 1/12 if there is no mother, no father, and a paternal grandmother exists.</li>
                    <li className="rounded-lg border border-border bg-white/80 p-3">Full sister [AnNisa 4:176] gets 1/2 if there is only one full sister, no offspring, no male paternal ancestor, and no full brother. Full sisters get 2/3 under the same conditions when there are multiple full sisters.</li>
                    <li className="rounded-lg border border-border bg-white/80 p-3">Paternal sister gets 1/2 if there is only one paternal sister, no offspring, no male paternal ancestor, and no full brother, full sister, or paternal brother. Paternal sisters get 2/3 under the same conditions when there are multiple paternal sisters. She gets 1/6 if there is just one full sister, no offspring, no male paternal ancestor, and no full brother or paternal brother.</li>
                    <li className="rounded-lg border border-border bg-white/80 p-3">Maternal sibling [AnNisa 4:12] gets 1/6 if there is only one maternal sibling, no male offspring, and no male paternal ancestors. Maternal siblings get 1/3 if there are multiple maternal siblings under the same conditions.</li>
                  </ol>
                </section>

                <section className="rounded-xl border border-border bg-white/80 p-5 shadow-sm">
                  <h3 className="text-lg font-bold text-primary mb-3">Blocking Rules</h3>
                  <ol className="list-decimal list-inside space-y-3 text-sm leading-6 text-black" start={13}>
                    <li className="rounded-lg border border-border bg-white/70 p-3">Son blocks paternal grandson, paternal granddaughter, full brother, full sister, paternal brother, paternal sister, maternal brother, maternal sister, full nephew, paternal nephew, full nephew's son, paternal nephew's son, full paternal uncle, paternal paternal uncle, full cousin, paternal cousin, full cousin's son, paternal cousin's son, full cousin's son's son, and paternal cousin's son's son.</li>
                    <li className="rounded-lg border border-border bg-white/70 p-3">Grandson blocks full brother, full sister, paternal brother, paternal sister, maternal brother, maternal sister, full nephew, paternal nephew, full nephew's son, paternal nephew's son, full paternal uncle, paternal paternal uncle, full cousin, paternal cousin, full cousin's son, paternal cousin's son, full cousin's son's son, and paternal cousin's son's son.</li>
                    <li className="rounded-lg border border-border bg-white/70 p-3">Father blocks paternal grandfather, paternal grandmother, full brother, full sister, paternal brother, paternal sister, maternal brother, maternal sister, full nephew, paternal nephew, full nephew's son, paternal nephew's son, full paternal uncle, paternal paternal uncle, full cousin, paternal cousin, full cousin's son, paternal cousin's son, full cousin's son's son, and paternal cousin's son's son.</li>
                    <li className="rounded-lg border border-border bg-white/70 p-3">Mother blocks paternal grandmother and maternal grandmother.</li>
                    <li className="rounded-lg border border-border bg-white/70 p-3">Grandfather blocks full nephew, paternal nephew, full nephew's son, paternal nephew's son, full paternal uncle, paternal paternal uncle, full cousin, paternal cousin, full cousin's son, paternal cousin's son, full cousin's son's son, and paternal cousin's son's son.</li>
                    <li className="rounded-lg border border-border bg-white/70 p-3">Full brother blocks paternal brother, paternal sister, full nephew, paternal nephew, full nephew's son, paternal nephew's son, full paternal uncle, paternal paternal uncle, full cousin, paternal cousin, full cousin's son, paternal cousin's son, full cousin's son's son, and paternal cousin's son's son.</li>
                    <li className="rounded-lg border border-border bg-white/70 p-3">Full sister blocks paternal brother, paternal sister, full nephew, paternal nephew, full nephew's son, paternal nephew's son, full paternal uncle, paternal paternal uncle, full cousin, paternal cousin, full cousin's son, paternal cousin's son, full cousin's son's son, and paternal cousin's son's son. She can only block when the deceased has at least one female offspring; otherwise she remains in the 2/3 zone.</li>
                    <li className="rounded-lg border border-border bg-white/70 p-3">Paternal brother blocks full nephew, paternal nephew, full nephew's son, paternal nephew's son, full paternal uncle, paternal paternal uncle, full cousin, paternal cousin, full cousin's son, paternal cousin's son, full cousin's son's son, and paternal cousin's son's son.</li>
                    <li className="rounded-lg border border-border bg-white/70 p-3">Paternal sister blocks full nephew, paternal nephew, full nephew's son, paternal nephew's son, full paternal uncle, paternal paternal uncle, full cousin, paternal cousin, full cousin's son, paternal cousin's son, full cousin's son's son, and paternal cousin's son's son. She can only block when the deceased has either at least one female offspring or at least two sisters; otherwise she remains in the 2/3 zone.</li>
                    <li className="rounded-lg border border-border bg-white/70 p-3">Full nephew blocks paternal nephew, full nephew's son, paternal nephew's son, full paternal uncle, paternal paternal uncle, full cousin, paternal cousin, full cousin's son, paternal cousin's son, full cousin's son's son, and paternal cousin's son's son.</li>
                    <li className="rounded-lg border border-border bg-white/70 p-3">Paternal nephew blocks full nephew's son, paternal nephew's son, full paternal uncle, paternal paternal uncle, full cousin, paternal cousin, full cousin's son, paternal cousin's son, full cousin's son's son, and paternal cousin's son's son.</li>
                    <li className="rounded-lg border border-border bg-white/70 p-3">Full nephew's son blocks paternal nephew's son, full paternal uncle, paternal paternal uncle, full cousin, paternal cousin, full cousin's son, paternal cousin's son, full cousin's son's son, and paternal cousin's son's son.</li>
                    <li className="rounded-lg border border-border bg-white/70 p-3">Paternal nephew's son blocks full paternal uncle, paternal paternal uncle, full cousin, paternal cousin, full cousin's son, paternal cousin's son, full cousin's son's son, and paternal cousin's son's son.</li>
                    <li className="rounded-lg border border-border bg-white/70 p-3">Full paternal uncle blocks paternal paternal uncle, full cousin, paternal cousin, full cousin's son, paternal cousin's son, full cousin's son's son, and paternal cousin's son's son.</li>
                    <li className="rounded-lg border border-border bg-white/70 p-3">Paternal paternal uncle blocks full cousin, paternal cousin, full cousin's son, paternal cousin's son, full cousin's son's son, and paternal cousin's son's son.</li>
                    <li className="rounded-lg border border-border bg-white/70 p-3">Full cousin blocks paternal cousin, full cousin's son, paternal cousin's son, full cousin's son's son, and paternal cousin's son's son.</li>
                    <li className="rounded-lg border border-border bg-white/70 p-3">Paternal cousin blocks full cousin's son, paternal cousin's son, full cousin's son's son, and paternal cousin's son's son.</li>
                    <li className="rounded-lg border border-border bg-white/70 p-3">Full cousin's son blocks paternal cousin's son, full cousin's son's son, and paternal cousin's son's son.</li>
                    <li className="rounded-lg border border-border bg-white/70 p-3">Paternal cousin's son blocks full cousin's son's son and paternal cousin's son's son.</li>
                    <li className="rounded-lg border border-border bg-white/70 p-3">Full cousin's son's son blocks paternal cousin's son's son.</li>
                  </ol>
                </section>

                <section className="rounded-xl border border-border bg-accent/5 p-5">
                  <h3 className="text-lg font-bold text-primary mb-3">Tasib and Residual Shares</h3>
                  <ol className="list-decimal list-inside space-y-3 text-sm leading-6 text-black" start={34}>
                    <li className="rounded-lg border border-border bg-white/80 p-3">Tasib ranking in order: 1. Son, daughter 2. Paternal grandson, paternal granddaughter 3. Father 4. Full brother, full sister 5. Paternal brother, paternal sister 6. Paternal grandfather 7. Full brother's son 8. Paternal brother's son 9. Full brother's son's son 10. Paternal brother's son's son 11. Paternal uncle (father's full brother) 12. Paternal paternal uncle (father's paternal brother) 13. Paternal uncle's son 14. Paternal paternal uncle's son 15. Paternal uncle's son's son 16. Paternal paternal uncle's son's son 17. Paternal uncle's son's son's son 18. Paternal paternal uncle's son's son's son 19. Emancipator 20. Emancipator's independent aaseebs.</li>
                    <li className="rounded-lg border border-border bg-white/80 p-3">A male and female of the same class share in the ratio 2:1 during residual distribution. This applies only to residual shares, not prescribed shares, and it does not apply to maternal siblings.</li>
                    <li className="rounded-lg border border-border bg-white/80 p-3">If an heir already has a prescribed share, that heir drops from taasib when other qualified aaseebs exist. Father is an exception to this rule.</li>
                    <li className="rounded-lg border border-border bg-white/80 p-3">A father or grandfather can never be cut off by heirs with prescribed shares.</li>
                    <li className="rounded-lg border border-border bg-white/80 p-3">In an Awal case, when total shares exceed 1, all shares are reduced proportionately so the total becomes 1.</li>
                    <li className="rounded-lg border border-border bg-white/80 p-3">In an Awal case with a grandfather present, sisters are removed from the 2/3 zone and the grandfather and sisters divide the remainder in a 2:1 ratio.</li>
                    <li className="rounded-lg border border-border bg-white/80 p-3">In a Radd case, when total shares are below 1, all shares except spouse shares are increased proportionately so the total becomes 1. Spouse shares stay fixed unless there are no far relatives.</li>
                    <li className="rounded-lg border border-border bg-white/80 p-3">If the husband is also a paternal cousin, or his offspring, or an emancipator, he is treated as two individuals and each qualified capacity is counted separately.</li>
                    <li className="rounded-lg border border-border bg-white/80 p-3">If the deceased left a spouse, father, and mother, but no offspring and multiple siblings, Umar's calculation applies: parents do not receive their prescribed share, the remainder is shared 2:1 between father and mother, and siblings can reduce the mother's share.</li>
                    <li className="rounded-lg border border-border bg-white/80 p-3">A full brother cannot receive less than the maternal brother. Full brothers are treated like maternal siblings for this rule.</li>
                    <li className="rounded-lg border border-border bg-white/80 p-3">If the deceased has no father or offspring but has a grandfather and siblings, the grandfather takes the maximum of A = 1/6 of the estate, B = 1/3 of the remainder, or C = the share obtained by treating the grandfather like a brother.</li>
                    <li className="rounded-lg border border-border bg-white/80 p-3">If the grandfather's share causes total shares to exceed 1, the regular 1/6 share is used and the max-of-A-B-C rule is ignored.</li>
                    <li className="rounded-lg border border-border bg-white/80 p-3">If the deceased has no father, offspring, or brother, but does have a grandfather and a sister, the prescribed sister share is discarded and sister and grandfather share the remainder in a 1:2 ratio.</li>
                    <li className="rounded-lg border border-border bg-white/80 p-3">Far relatives are distributed by replacing themselves with the qualified link they are attached to.</li>
                    <li className="rounded-lg border border-border bg-white/80 p-3">If there is still a remainder, it can be given to the spouse if the spouse is alive.</li>
                    <li className="rounded-lg border border-border bg-white/80 p-3">If the deceased has absolutely no relatives, the Islamic state takes the entire estate.</li>
                    <li className="rounded-lg border border-border bg-white/80 p-3">Female heirs do not pass inheritance to their children the way male heirs do.</li>
                    <li className="rounded-lg border border-border bg-white/80 p-3">In the absence of immediate children, grandchildren replace them as heirs.</li>
                    <li className="rounded-lg border border-border bg-white/80 p-3">The 2/3 zone applies to daughter, paternal granddaughter, full sister, and paternal sister. A male sibling of the same class can move her out of the 2/3 zone.</li>
                    <li className="rounded-lg border border-border bg-white/80 p-3">Female offspring can never be together with female siblings in the 2/3 zone. One of the two groups takes 1/2 and the other takes 1/6.</li>
                    <li className="rounded-lg border border-border bg-white/80 p-3">Full brother can get the paternal sister out of the 2/3 zone and may fully block her.</li>
                    <li className="rounded-lg border border-border bg-white/80 p-3">Full sister and paternal sister cannot share the 2/3 fraction with female offspring. The 2/3 fraction is either for daughter-granddaughter or for full sister-paternal sister.</li>
                  </ol>
                </section>

                <section className="rounded-xl border border-border bg-white/80 p-5 shadow-sm">
                  <h3 className="text-lg font-bold text-primary mb-3">Additional Principles</h3>
                  <ol className="list-decimal list-inside space-y-3 text-sm leading-6 text-black" start={56}>
                    <li className="rounded-lg border border-border bg-white/70 p-3">Maternal siblings can reduce the mother's share.</li>
                    <li className="rounded-lg border border-border bg-white/70 p-3">Maternal siblings do not follow the 1:2 male-female ratio.</li>
                    <li className="rounded-lg border border-border bg-white/70 p-3">Father blocks full siblings, paternal siblings, and maternal siblings.</li>
                    <li className="rounded-lg border border-border bg-white/70 p-3">The following relatives can never be blocked: husband, wife, father, mother, son, and daughter.</li>
                    <li className="rounded-lg border border-border bg-white/70 p-3">Spouses can neither be blocked nor block anyone else.</li>
                    <li className="rounded-lg border border-border bg-white/70 p-3">Spouse shares can never be increased unless no far relatives are found.</li>
                    <li className="rounded-lg border border-border bg-white/70 p-3">Role promotion when a person is not alive: grandfather becomes father, paternal grandmother becomes mother, granddaughter becomes daughter, sister becomes daughter, and paternal sister becomes daughter.</li>
                    <li className="rounded-lg border border-border bg-white/70 p-3">Maternal grandfather is blocked from inheritance. His male and female ancestors are also blocked. Maternal grandmother does inherit, and her female ancestors may inherit, but not the male ancestors.</li>
                    <li className="rounded-lg border border-border bg-white/70 p-3">The only female chain that continues indefinitely is mother's mother's mother and so on.</li>
                    <li className="rounded-lg border border-border bg-white/70 p-3">A mother can block the father's mother. There is a difference of opinion about the father blocking the father's mother.</li>
                    <li className="rounded-lg border border-border bg-white/70 p-3">The following relatives are not qualified for taasib: mother, paternal grandmother, maternal grandmother, husband, wife, maternal brother, and maternal sister.</li>
                    <li className="rounded-lg border border-border bg-white/70 p-3">Joint taasib is possible only for these pairs: son and daughter, grandson and granddaughter, full brother and full sister, and paternal brother and paternal sister.</li>
                  </ol>
                </section>
              </div>
            </div>
          </section>
        )}

        {/* Test Cases Tab */}
        {activeTab === 'testCases' && (
          <section className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8 border border-border">
              <div className="flex items-center gap-3 mb-6">
                <Gift className="text-primary" size={32} />
                <div>
                  <h2 className="text-2xl font-bold text-primary">{text.testCases.title}</h2>
                  <p className="text-black">{text.testCases.desc}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {testCases.map((testCase) => (
                  <Link
                    key={testCase.id}
                    href={`/results?ID=${testCase.id}`}
                    className="p-4 border border-border rounded-lg hover:bg-primary/5 hover:border-primary transition-colors text-left"
                  >
                    <p className="font-semibold text-primary hover:underline">{testCase.name}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Books Tab */}
        {activeTab === 'books' && (
          <section className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8 border border-border">
              <div className="flex items-center gap-3 mb-6">
                <Book className="text-primary" size={32} />
                <div>
                  <h2 className="text-2xl font-bold text-primary">{text.books.title}</h2>
                  <p className="text-black">{text.books.desc}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {text.books.books.map((book, index) => (
                  book.url ? (
                    <a
                      key={index}
                      href={book.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 border border-border rounded-lg hover:bg-primary/5 hover:border-primary transition-colors"
                    >
                      <p className="font-semibold text-primary hover:underline">{book.name}</p>
                    </a>
                  ) : (
                    <div
                      key={index}
                      className="p-4 border border-border rounded-lg bg-gray-50"
                    >
                      <p className="font-semibold text-muted-foreground">{book.name}</p>
                    </div>
                  )
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Contact Tab */}
        {activeTab === 'contact' && (
          <section className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8 border border-border">
              <div className="flex items-center gap-3 mb-6">
                <Mail className="text-primary" size={32} />
                <div>
                  <h2 className="text-2xl font-bold text-primary">Contact Us</h2>
                  <p className="text-black">Send your feedback and questions</p>
                </div>
              </div>

              <form className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Name"
                  className="w-full px-4 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary text-black"
                />
                <input 
                  type="email" 
                  placeholder="Email"
                  className="w-full px-4 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary text-black"
                />
                <textarea 
                  placeholder="Message"
                  rows={5}
                  className="w-full px-4 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary text-black"
                ></textarea>
                <button type="submit" className="w-full primary-btn py-3 rounded font-semibold">
                  Submit
                </button>
              </form>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-primary text-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p>&copy; 2026 Islamic Inheritance Calculator. All rights reserved.</p>
            <p className="text-accent-light text-sm mt-2">Based on Hanafi Fiqh principles</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
