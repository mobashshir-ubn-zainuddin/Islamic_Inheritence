'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Book } from 'lucide-react';
import { Header } from './components/Header';
import { calculateInheritance, InheritanceInput } from '@/lib/api';

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

export default function HomeContent() {
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
  const [loading, setLoading] = useState(false);
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

  // Convert our relative state into the format backend expects
  const convertRelativesToBackendFormat = () => {
    const backendRelatives: InheritanceInput['relatives'] = [];
    // Map keys from our state to backend RelativeType
    const keyToType: Record<string, string> = {
      husband: 'husband',
      wives: 'wife', // Note: backend uses 'wife' not 'wives', count is number of wives
      sons: 'son',
      daughters: 'daughter',
      grandsons: 'grandson',
      granddaughters: 'granddaughter',
      father: 'father',
      mother: 'mother',
      grandfather: 'grandfather',
      paternal_grandmother: 'paternal_grandmother',
      maternal_grandmother: 'maternal_grandmother',
      full_brothers: 'full_brother',
      full_sisters: 'full_sister',
      paternal_brothers: 'paternal_brother',
      paternal_sisters: 'paternal_sister',
      maternal_brothers: 'maternal_brother',
      maternal_sisters: 'maternal_sister',
      full_nephews: 'full_nephew',
      paternal_nephews: 'paternal_nephew',
      full_nephew_sons: 'full_nephew_son',
      paternal_nephew_sons: 'paternal_nephew_son',
      full_uncles: 'full_uncle',
      paternal_uncles: 'paternal_uncle',
      full_cousins: 'full_cousin',
      paternal_cousins: 'paternal_cousin',
      full_cousin_sons: 'full_cousin_son',
      paternal_cousin_sons: 'paternal_cousin_son',
      full_cousin_grandsons: 'full_cousin_grandson',
      paternal_cousin_grandsons: 'paternal_cousin_grandson',
    };

    for (const [key, count] of Object.entries(relatives)) {
      if (count > 0 && keyToType[key]) {
        backendRelatives.push({
          relative_type: keyToType[key],
          count: count,
        });
      }
    }

    return backendRelatives;
  };

  const calculateInheritanceHandler = async () => {
    if (estateValue <= 0) {
      setCalculationError('Please enter an estate value.');
      return;
    }
    setLoading(true);
    setCalculationError(null);

    try {
      const backendRelatives = convertRelativesToBackendFormat();

      if (backendRelatives.length === 0) {
        setCalculationError('Please select at least one heir.');
        setLoading(false);
        return;
      }

      const input: InheritanceInput = {
        total_estate: estateValue,
        relatives: backendRelatives,
      };

      const result = await calculateInheritance(input);
      // Save to localStorage and navigate
      const resultId = crypto.randomUUID();
      localStorage.setItem(`inheritanceResults:${resultId}`, JSON.stringify(result));
      localStorage.setItem('inheritanceResults', JSON.stringify(result));
      router.push(`/results/${resultId}`);
    } catch (error: any) {
      setCalculationError(error.response?.data?.detail || 'Failed to calculate inheritance.');
    } finally {
      setLoading(false);
    }
  };

  const handleRelativeChange = (key: string, count: number) => {
    setRelatives({...relatives, [key]: Math.max(0, count)});
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
        full_brothersDesc: 'Brothers who share the same father and mother with the deceased.',
        full_sisters: 'Full Sisters',
        full_sistersDesc: 'Sisters who share the same father and mother with the deceased.',
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
        desc: 'Test cases on which the inheritence calculation was tested. Includes special cases and edge cases.',
      },
      books: {
        title: 'Recommended Books',
        desc: 'Essential references on Islamic inheritance',
        books: [
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
        title: 'فتاویٰ تلاش اور حوالہ جات',
        desc: 'مشہور دارالفتاؤں سے اسلامی احکام تلاش کریں',
        references: 'دارالفتا کے حوالہ جات',
        daruliftas: [
          { name: 'دارالفتا دیوبند (انگریزی)', url: 'https://darulifta-deoband.com/en' },
          { name: 'دارالفتا دیوبند (اردو)', url: 'https://darulifta-deoband.com/' },
          { name: 'دارالفتا جامعہ بنوریہ (انگریزی)', url: 'https://www.onlinefatawa.com/EnglishFatwa' },
          { name: 'دارالفتا جامعہ بنوریہ (اردو)', url: 'https://www.onlinefatawa.com/' },
          { name: 'دارالفتا جامعہ دارالعلوم کراچی', url: 'https://onlinedarulifta.com/' },
        ],
        askFatwa: 'فتوا پوچھیں',
        searchPlaceholder: 'فتاویں تلاش کریں...',
      },
      chatbot: {
        title: 'وراثت کے منظرناموں کا چیٹ بوٹ',
        desc: 'تعامل کے منظرناموں کے ذریعے وراثت کے بارے میں سیکھیں',
        scenario1: 'آسان منظرنامہ',
        scenario2: 'پیچیدہ کیس',
        message: 'وراثت کے منظرناموں کے بارے میں پوچھیں...',
      },
      rules: {
        title: 'وراثت کے قوانین',
        desc: 'اسلامی وراثت کے لئے قرآنی اور حدیث پر مبنی قوانین',
        prescribed: 'مقررہ حصص',
        husband: 'شوہر کو 1/4 (اگر بچے نہ ہوں) یا 1/2 (اگر بچے ہوں)',
        wife: 'بیوی/بیویوں کو 1/4 (اگر بچے نہ ہوں) یا 1/8 (اگر بچے ہوں)',
      },
      testCases: {
        title: 'ٹیسٹ کیسز',
        desc: 'ٹیسٹ کیسز جن پر وراثت کے حساب کو جانچا گیا۔ خاص کیسز اور کنارے کے کیسز شامل ہیں۔',
      },
      books: {
        title: 'تجویز کردہ کتابیں',
        desc: 'اسلامی وراثت پر ضروری حوالہ جات',
        books: [
          { name: 'السیراجیہ (السیراجي في الميراث) - انگریزی ترجمہ', url: 'https://dn790007.ca.archive.org/0/items/AsSirajiyyahAsSirajiFilMirathEnglishTranslation/As-Sirajiyyah%20%28As%20Siraji%20fil%20Mirath%29%20-%20English%20Translation.pdf' }
        ],
      },
    },
  };

  const text = t[lang as keyof typeof t] as typeof t.en;

  return (
    <div className="min-h-screen bg-islamic-pattern"
         style={{backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(15, 95, 95, 0.05) 0%, transparent 50%)'}}>
      <Header />
      <header className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="accent-text text-sm uppercase tracking-[0.24em]">{text.subtitle}</p>
            <h1 className="text-4xl font-bold mt-2">{text.title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang(lang === 'en' ? 'ur' : 'en')}
              className="px-4 py-2 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition">
              {lang === 'en' ? 'Urdu' : 'English'}
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <nav className="container mx-auto px-4 mb-8">
        <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
          {Object.entries(text.tabs).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-4 py-2 rounded-t-lg transition-all ${
                activeTab === key
                  ? 'bg-emerald-600 text-white font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </nav>

      {/* Calculator Tab */}
      {activeTab === 'calculator' && (
        <main className="container mx-auto px-4 pb-16">
          <section className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">{text.calculator.title}</h2>
            <p className="text-gray-600 mb-8">{text.calculator.desc}</p>
            
            {calculationError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-700">{calculationError}</p>
              </div>
            )}

            {/* Estate Value */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {text.calculator.estate}
              </label>
              <input
                type="number"
                value={estateValue}
                onChange={(e) => setEstateValue(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Enter estate value"
              />
            </div>

            {/* Relatives Inputs */}
            <div>
              <h3 className="text-xl font-medium text-gray-800 mb-6">{text.calculator.relatives}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(text.calculator)
                  .filter(([key]) => key !== 'title' && key !== 'desc' && key !== 'estate' && key !== 'relatives' && key !== 'calculate' && key !== 'results')
                  .map(([key, label]) => {
                    const descKey = key + 'Desc' as keyof typeof text.calculator;
                    const desc = (text.calculator as any)[descKey];

                    return (
                      <div key={key} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <label className="font-medium text-gray-800">{label}</label>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleRelativeChange(key, relatives[key] - 1)}
                                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                              >-</button>
                              <span className="w-8 text-center">{relatives[key]}</span>
                              <button
                                onClick={() => handleRelativeChange(key, relatives[key] + 1)}
                                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                              >+</button>
                            </div>
                          </div>
                          {desc && <p className="text-xs text-gray-500">{desc}</p>}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            <div className="mt-10">
              <button
                onClick={calculateInheritanceHandler}
                disabled={loading}
                className="w-full md:w-auto px-8 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
              >
                {loading ? 'Calculating...' : text.calculator.calculate}
              </button>
            </div>
          </section>
        </main>
      )}

      {/* Fatwas Tab */}
      {activeTab === 'fatwas' && (
        <main className="container mx-auto px-4 pb-16">
          <section className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">{text.fatwas.title}</h2>
            <p className="text-gray-600 mb-8">{text.fatwas.desc}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {text.fatwas.daruliftas.map((source, i) => (
                <a
                  key={i}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
                >
                  <h3 className="font-medium text-gray-800">{source.name}</h3>
                </a>
              ))}
            </div>
          </section>
        </main>
      )}

      {/* Chatbot Tab (Placeholder) */}
      {activeTab === 'chatbot' && (
        <main className="container mx-auto px-4 pb-16">
          <section className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">{text.chatbot.title}</h2>
            <p className="text-gray-600 mb-8">{text.chatbot.desc}</p>
            <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
              Chatbot feature coming soon!
            </div>
          </section>
        </main>
      )}

      {/* Rules Tab */}
      {activeTab === 'rules' && (
        <main className="container mx-auto px-4 pb-16">
          <section className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">{text.rules.title}</h2>
            <p className="text-gray-600 mb-8">{text.rules.desc}</p>

            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-800 mb-2">Quran 4:11</h3>
                <p className="text-gray-600">Allah instructs you concerning your children: for the male, what is equal to the share of two females...</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-800 mb-2">Quran 4:12</h3>
                <p className="text-gray-600">And for you is half of what your wives leave if they have no child...</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-800 mb-2">{text.rules.prescribed}</h3>
                <ul className="mt-2 space-y-2 text-gray-600">
                  <li>{text.rules.husband}</li>
                  <li>{text.rules.wife}</li>
                </ul>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* Test Cases Tab */}
      {activeTab === 'testCases' && (
        <main className="container mx-auto px-4 pb-16">
          <section className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">{text.testCases.title}</h2>
            <p className="text-gray-600 mb-8">{text.testCases.desc}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {testCases.map((tc) => (
                <Link
                  key={tc.id}
                  href={`/?ID=${tc.id}`}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-emerald-50 transition"
                >
                  <h3 className="font-medium text-gray-800">{tc.name}</h3>
                </Link>
              ))}
            </div>
          </section>
        </main>
      )}

      {/* Books Tab */}
      {activeTab === 'books' && (
        <main className="container mx-auto px-4 pb-16">
          <section className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">{text.books.title}</h2>
            <p className="text-gray-600 mb-8">{text.books.desc}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {text.books.books.map((book, i) => (
                <a
                  key={i}
                  href={book.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-4">
                    <Book className="w-8 h-8 text-emerald-600" />
                    <h3 className="font-medium text-gray-800">{book.name}</h3>
                  </div>
                </a>
              ))}
            </div>
          </section>
        </main>
      )}

      {/* Contact Tab */}
      {activeTab === 'contact' && (
        <main className="container mx-auto px-4 pb-16">
          <section className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Contact</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input type="email" className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea rows={4} className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
              </div>
              <button
                type="button"
                className="px-8 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition"
              >
                Send
              </button>
            </form>
          </section>
        </main>
      )}
    </div>
  );
}
