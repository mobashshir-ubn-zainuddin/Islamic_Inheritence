'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Book, MessageCircle, Scale, BookOpen, Gift, Mail } from 'lucide-react';
import { Header } from './components/Header';
import { calculateInheritance as calculateInheritanceAPI, RelativeType } from '../lib/api';

// Test cases data structure
const testCases = [
  { id: 1, name: "Test Case #1 (Son 1)", relatives: { sons: 1 } },
];

export default function Home() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState('calculator');
  const [lang, setLang] = useState<'en' | 'ur'>('en');
  const [relatives, setRelatives] = useState<{[key: string]: number}>({
    husband: 0,
    wives: 0,
    sons: 0,
    daughters: 0,
    father: 0,
    mother: 0,
  });
  const [calculationError, setCalculationError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
          father: 0,
          mother: 0,
        };
        setRelatives({ ...baseRelatives, ...foundTestCase.relatives });
        setActiveTab('calculator');
      }
    }
  }, [searchParams]);

  const handleRelativeChange = (key: string, count: number) => {
    setRelatives({...relatives, [key]: Math.max(0, count)});
    setCalculationError(null);
  };
  
  // Calculate inheritance shares based on Hanafi Islamic law
  const calculateInheritance = async () => {
    setLoading(true);
    setCalculationError(null);

    try {
      // Convert our relative state into the format backend expects
      const backendRelatives = [];
      // Map keys from our state to backend RelativeType
      const keyToType: Record<string, RelativeType> = {
        husband: RelativeType.HUSBAND,
        wives: RelativeType.WIFE, // Note: backend uses 'wife' not 'wives', count is number of wives
        sons: RelativeType.SON,
        daughters: RelativeType.DAUGHTER,
        father: RelativeType.FATHER,
        mother: RelativeType.MOTHER,
      };

      for (const [key, count] of Object.entries(relatives)) {
        if (count > 0 && keyToType[key]) {
          backendRelatives.push({
            relative_type: keyToType[key],
            count: count,
          });
        }
      }

      if (backendRelatives.length === 0) {
        setCalculationError('Please select at least one heir.');
        setLoading(false);
        return;
      }

      // Use dummy estate value since we don't need actual amount
      const dummyEstate = 1000000;
      const data = await calculateInheritanceAPI({
        total_estate: dummyEstate,
        relatives: backendRelatives,
      });
      // Save to localStorage and navigate
      localStorage.setItem('inheritanceResults', JSON.stringify(data));
      router.push('/results');
    } catch (error: any) {
      setCalculationError(error.response?.data?.detail || 'Failed to calculate inheritance.');
    } finally {
      setLoading(false);
    }
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
        father: 'Father',
        fatherDesc: 'Illegitimate father, or step-father is not eligible.',
        mother: 'Mother',
        motherDesc: 'Illegitimate mother, or step-mother is not eligible.',
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
        father: 'والد',
        fatherDesc: 'ناجائز والد، یا سوتیلا والد اہل نہیں ہے۔',
        mother: 'والدہ',
        motherDesc: 'ناجائز والدہ، یا سوتیلی والدہ اہل نہیں ہے۔',
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
                    <h3 className="font-bold text-primary mb-4 text-black">{text.calculator.relatives}</h3>
                    {[
                      'husband',
                      'wives',
                      'sons',
                      'daughters',
                      'father',
                      'mother',
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

                  <button onClick={calculateInheritance} disabled={loading} className="w-full primary-btn py-3 rounded font-semibold">
                    {loading ? 'Calculating...' : text.calculator.calculate}
                  </button>
                  
                  {calculationError && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-600 font-medium">{calculationError}</p>
                    </div>
                  )}
                  
                  <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h3 className="text-lg font-bold text-yellow-800 mb-2">Important Notes</h3>
                    <ul className="list-disc list-inside space-y-2 text-yellow-800">
                      <li>An unborn child is treated as having the same status as a born child.</li>
                      <li>Non-Muslim relatives are not eligible for inheritance. They might, however, receive the bequeathal.</li>
                    </ul>
                  </div>
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
                  <ol className="list-decimal list-inside space-y-4 text-sm leading-6 text-black">
                    <li className="rounded-lg border border-border bg-white/80 p-3">
                      <strong>Husband [AnNisa 4:12]</strong>
                      <ul className="list-disc list-inside ml-4 mt-2">
                        <li>a. Gets 1/2 if the deceased does not have any offspring</li>
                        <li>b. Gets 1/4 if the deceased has offspring</li>
                      </ul>
                    </li>
                    <li className="rounded-lg border border-border bg-white/80 p-3">
                      <strong>Wife (Divided equally among all wives) [AnNisa 4:12]</strong>
                      <ul className="list-disc list-inside ml-4 mt-2">
                        <li>a. Gets 1/4 if the deceased does not have any offspring</li>
                        <li>b. Gets 1/8 if the deceased has offspring</li>
                      </ul>
                    </li>
                    <li className="rounded-lg border border-border bg-white/80 p-3">
                      <strong>Daughter (Divided equally among all daughters)</strong>
                      <ul className="list-disc list-inside ml-4 mt-2">
                        <li>a. Gets 1/2 [AnNisa 4:11] if the deceased has only 1 daughter and does not have any sons</li>
                        <li>b. Gets 2/3 [AnNisa 4:11] if the deceased has multiple daughters and does not have any sons</li>
                      </ul>
                    </li>
                    <li className="rounded-lg border border-border bg-white/80 p-3">
                      <strong>Grand Daughter (from son only)</strong>
                      <ul className="list-disc list-inside ml-4 mt-2">
                        <li>a. Gets 1/2 if the deceased has only 1 Grand daughter from a son, does not have a son or a daughter, and does not have a Grandson from a son</li>
                        <li>b. Gets 2/3 if the deceased has multiple Granddaughters from a son, does not have a son or a daughter, and does not have a Grandson from a son</li>
                        <li>c. Gets 1/6 (H1) if the deceased has just one daughter, does not have a son, and does not have a Grandson from a son</li>
                      </ul>
                    </li>
                    <li className="rounded-lg border border-border bg-white/80 p-3">
                      <strong>Father [AnNisa 4:11]</strong>
                      <ul className="list-disc list-inside ml-4 mt-2">
                        <li>a. Gets 1/6 if the deceased has offspring</li>
                      </ul>
                    </li>
                    <li className="rounded-lg border border-border bg-white/80 p-3">
                      <strong>Mother [AnNisa 4:11]</strong>
                      <ul className="list-disc list-inside ml-4 mt-2">
                        <li>a. Gets 1/3 if the deceased does not have any offspring and does not have multiple siblings (full, paternal, maternal)</li>
                        <li>b. Gets 1/6 if the deceased has offspring or has multiple siblings (full, paternal, maternal)</li>
                      </ul>
                    </li>
                    <li className="rounded-lg border border-border bg-white/80 p-3">
                      <strong>Paternal Grand Father</strong>
                      <ul className="list-disc list-inside ml-4 mt-2">
                        <li>a. Gets 1/6 if the deceased does not have a father and has offspring</li>
                      </ul>
                    </li>
                    <li className="rounded-lg border border-border bg-white/80 p-3">
                      <strong>Paternal Grand Mother</strong>
                      <ul className="list-disc list-inside ml-4 mt-2">
                        <li>a. Gets 1/6 if the deceased does not have a mother, does not have a father, and does not have a maternal grandmother</li>
                        <li>b. Gets 1/12 if the deceased does not have a mother, does not have a father, and has a maternal grandmother</li>
                      </ul>
                    </li>
                    <li className="rounded-lg border border-border bg-white/80 p-3">
                      <strong>Maternal Grand Mother</strong>
                      <ul className="list-disc list-inside ml-4 mt-2">
                        <li>a. Gets 1/6 if the deceased does not have a mother</li>
                        <li>b. Gets 1/12 if the deceased does not have a mother, does not have a father, and has a paternal grandmother</li>
                      </ul>
                    </li>
                    <li className="rounded-lg border border-border bg-white/80 p-3">
                      <strong>Full Sister</strong>
                      <ul className="list-disc list-inside ml-4 mt-2">
                        <li>a. Gets ½ [AnNisa 4:176] if the deceased has only 1 full sister, does not have any offspring, does not have any male paternal ancestor, and does not have any full brother</li>
                        <li>b. Gets 2/3 [AnNisa 4:176] if the deceased has multiple full sisters, does not have any offspring, does not have any male paternal ancestor, and does not have any full brother</li>
                      </ul>
                    </li>
                    <li className="rounded-lg border border-border bg-white/80 p-3">
                      <strong>Paternal Sister</strong>
                      <ul className="list-disc list-inside ml-4 mt-2">
                        <li>a. Gets 1/2 if the deceased has only 1 paternal sister, does not have any offspring, does not have any male paternal ancestor, and does not have any full brother, full sister or paternal brother</li>
                        <li>b. Gets 2/3 if the deceased has multiple paternal sisters, does not have any offspring, does not have any male paternal ancestor, and does not have any full brother, full sister or paternal brother</li>
                        <li>c. Gets 1/6 if the deceased has just 1 full sister, does not have any offspring, does not have any male paternal ancestor, and does not have any full brother or paternal brother</li>
                      </ul>
                    </li>
                    <li className="rounded-lg border border-border bg-white/80 p-3">
                      <strong>Maternal Sibling [AnNisa 4:12]</strong>
                      <ul className="list-disc list-inside ml-4 mt-2">
                        <li>a. Gets 1/6 if the deceased has only 1 maternal sibling, does not have any male offspring, and does not have any male paternal ancestors</li>
                        <li>b. Gets 1/3 if the deceased has multiple maternal siblings, does not have any male offspring, and does not have any male paternal ancestors</li>
                      </ul>
                    </li>
                  </ol>
                </section>
                <section className="rounded-xl border border-border bg-accent/5 p-5">
                  <h3 className="text-lg font-bold text-primary mb-3">Blocking Rules</h3>
                  <ol start="13" className="list-decimal list-inside space-y-3 text-sm leading-6 text-black">
                    <li className="rounded-lg border border-border bg-white/80 p-3">
                      <strong>Blocking Rules</strong>
                      <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
                        <li>a. Son blocks Paternal Grandson, Paternal Granddaughter, Full brother, Full sister, Paternal brother, Paternal sister, Maternal Brother, Maternal sister, Full Nephew, Paternal Nephew, Full Nephew’s son, Paternal Nephew’s son, Full paternal Uncle, Paternal paternal uncle, Full cousin, Paternal Cousin, Full cousin’s son, Paternal Cousin’s son, Full cousin’s son’s son, Paternal Cousin’s son’s son</li>
                        <li>b. Grandson blocks Full brother, Full sister, Paternal brother, Paternal sister, Maternal Brother, Maternal sister, Full Nephew, Paternal Nephew, Full Nephew’s son, Paternal Nephew’s son, Full paternal Uncle, Paternal paternal uncle, Full cousin, Paternal Cousin, Full cousin’s son, Paternal Cousin’s son, Full cousin’s son’s son, Paternal Cousin’s son’s son</li>
                        <li>c. Father blocks Paternal Grandfather, Paternal Grandmother, Full brother, Full sister, Paternal brother, Paternal sister, Maternal Brother, Maternal sister, Full Nephew, Paternal Nephew, Full Nephew’s son, Paternal Nephew’s son, Full paternal Uncle, Paternal paternal uncle, Full cousin, Paternal Cousin, Full cousin’s son, Paternal Cousin’s son, Full cousin’s son’s son, Paternal Cousin’s son’s son</li>
                        <li>d. Mother blocks Paternal Grandmother, Maternal Grandmother</li>
                        <li>e. Grandfather blocks Full Nephew, Paternal Nephew, Full Nephew’s son, Paternal Nephew’s son, Full paternal Uncle, Paternal paternal uncle, Full cousin, Paternal Cousin, Full cousin’s son, Paternal Cousin’s son, Full cousin’s son’s son, Paternal Cousin’s son’s son</li>
                        <li>f. Full brother blocks Paternal brother, Paternal sister, Full Nephew, Paternal Nephew, Full Nephew’s son, Paternal Nephew’s son, Full paternal Uncle, Paternal paternal uncle, Full cousin, Paternal Cousin, Full cousin’s son, Paternal Cousin’s son, Full cousin’s son’s son, Paternal Cousin’s son’s son</li>
                        <li>g. Full sister blocks Paternal brother, Paternal sister, Full Nephew, Paternal Nephew, Full Nephew’s son, Paternal Nephew’s son, Full paternal Uncle, Paternal paternal uncle, Full cousin, Paternal Cousin, Full cousin’s son, Paternal Cousin’s son, Full cousin’s son’s son, Paternal Cousin’s son’s son (can block only if the deceased has at least 1 female offspring, otherwise stuck in 2/3 zone)</li>
                        <li>h. Paternal brother blocks Full Nephew, Paternal Nephew, Full Nephew’s son, Paternal Nephew’s son, Full paternal Uncle, Paternal paternal uncle, Full cousin, Paternal Cousin, Full cousin’s son, Paternal Cousin’s son, Full cousin’s son’s son, Paternal Cousin’s son’s son</li>
                        <li>i. Paternal sister blocks Full Nephew, Paternal Nephew, Full Nephew’s son, Paternal Nephew’s son, Full paternal Uncle, Paternal paternal uncle, Full cousin, Paternal Cousin, Full cousin’s son, Paternal Cousin’s son, Full cousin’s son’s son, Paternal Cousin’s son’s son (can block only if the deceased has either at least 1 female offspring or at least 2 sisters, otherwise stuck in 2/3 zone)</li>
                        <li>j. Full Nephew blocks Paternal Nephew, Full Nephew’s son, Paternal Nephew’s son, Full paternal Uncle, Paternal paternal uncle, Full cousin, Paternal Cousin, Full cousin’s son, Paternal Cousin’s son, Full cousin’s son’s son, Paternal Cousin’s son’s son</li>
                        <li>k. Paternal Nephew blocks Full Nephew’s son, Paternal Nephew’s son, Full paternal Uncle, Paternal paternal uncle, Full cousin, Paternal Cousin, Full cousin’s son, Paternal Cousin’s son, Full cousin’s son’s son, Paternal Cousin’s son’s son</li>
                        <li>l. Full Nephew’s son blocks Paternal Nephew’s son, Full paternal Uncle, Paternal paternal uncle, Full cousin, Paternal Cousin, Full cousin’s son, Paternal Cousin’s son, Full cousin’s son’s son, Paternal Cousin’s son’s son</li>
                        <li>m. Paternal Nephew’s son blocks Full paternal Uncle, Paternal paternal uncle, Full cousin, Paternal Cousin, Full cousin’s son, Paternal Cousin’s son, Full cousin’s son’s son, Paternal Cousin’s son’s son</li>
                        <li>n. Full paternal Uncle blocks Paternal paternal uncle, Full cousin, Paternal Cousin, Full cousin’s son, Paternal Cousin’s son, Full cousin’s son’s son, Paternal Cousin’s son’s son</li>
                        <li>o. Paternal paternal uncle blocks Full cousin, Paternal Cousin, Full cousin’s son, Paternal Cousin’s son, Full cousin’s son’s son, Paternal Cousin’s son’s son</li>
                        <li>p. Full cousin blocks Paternal Cousin, Full cousin’s son, Paternal Cousin’s son, Full cousin’s son’s son, Paternal Cousin’s son’s son</li>
                        <li>q. Paternal Cousin blocks Full cousin’s son, Paternal Cousin’s son, Full cousin’s son’s son, Paternal Cousin’s son’s son</li>
                        <li>r. Full cousin’s son blocks Paternal Cousin’s son, Full cousin’s son’s son, Paternal Cousin’s son’s son</li>
                        <li>s. Paternal Cousin’s son blocks Full cousin’s son’s son, Paternal Cousin’s son’s son</li>
                        <li>t. Full cousin’s son’s son blocks Paternal Cousin’s son’s son</li>
                      </ul>
                    </li>
                  </ol>
                </section>
                <section className="rounded-xl border border-border bg-accent/5 p-5">
                  <h3 className="text-lg font-bold text-primary mb-3">Tasib Ranking in Order</h3>
                  <ol start="14" className="list-decimal list-inside space-y-3 text-sm leading-6 text-black">
                    <li className="rounded-lg border border-border bg-white/80 p-3">
                      <strong>Tasib ranking in order</strong>
                      <ol className="list-decimal list-inside ml-4 mt-2">
                        <li>Son, daughter</li>
                        <li>Paternal Grandson, paternal Granddaughter</li>
                        <li>Father</li>
                        <li>Full Brother, Full sister (Kalaalah starts here)</li>
                        <li>Paternal Brother, Paternal Sister</li>
                        <li>Paternal Grandfather</li>
                        <li>Full brother’s son</li>
                        <li>Paternal brother’s son</li>
                        <li>Full brother’s son’s son</li>
                        <li>Paternal brother son’s son</li>
                        <li>Paternal uncle (father’s full brother)</li>
                        <li>Paternal paternal uncle (father’s paternal brother)</li>
                        <li>Paternal uncle’s son (father’s brother’s son)</li>
                        <li>Paternal paternal uncle’s son (father’s paternal brother’s son)</li>
                        <li>Paternal uncle’s son’s son (father’s brother’s son’ s son)</li>
                        <li>Paternal paternal uncle’s son’s son (father’s paternal brother’s son’s son)</li>
                        <li>Paternal uncle’s son’s son’s son (father’s brother’s son’ s son’s son)</li>
                        <li>Paternal paternal uncle’s son’s son’s son (father’s paternal brother’s son’s son’s son)</li>
                        <li>Emancipator</li>
                        <li>Emancipator’s independent Aaseebs</li>
                      </ol>
                    </li>
                  </ol>
                </section>
                <section className="rounded-xl border border-border bg-accent/5 p-5">
                  <h3 className="text-lg font-bold text-primary mb-3">Additional Rules</h3>
                  <ol start="15" className="list-decimal list-inside space-y-4 text-sm leading-6 text-black">
                    <li className="rounded-lg border border-border bg-white/80 p-3">
                      A male & female of the same class receive shares with the ratio of 2:1 [AnNisa 4:11], [AnNisa 4:176]. The following conditions should be met:
                      <ul className="list-disc list-inside ml-4 mt-2">
                        <li>a. Male & female are of the same class</li>
                        <li>b. This rule applies during the distribution of residual shares, and not the distribution of prescribed shares</li>
                        <li>c. This rule doesn’t apply to maternal siblings. They are either ways given from prescribed shares</li>
                      </ul>
                    </li>
                    <li className="rounded-lg border border-border bg-white/80 p-3">
                      If an heir is given the prescribed share, he/she drops from Ta’seeb if there are other Aaseebs qualified for inheritance
                      <ul className="list-disc list-inside ml-4 mt-2">
                        <li>a. Father is an exception to this rule</li>
                      </ul>
                    </li>
                    <li className="rounded-lg border border-border bg-white/80 p-3">A father, or a grandfather, can never be cutoff by the heirs with prescribed shares.</li>
                    <li className="rounded-lg border border-border bg-white/80 p-3">
                      In the ‘Awal case, when the total is more than 1, all shares should be reduced proportionately so that the total shares is 1
                      <ul className="list-disc list-inside ml-4 mt-2">
                        <li>a. In case of Awal, and in the presence of Grandfather, sisters will be removed from the 2/3rd zone. Grandfather & sisters then will divide in the ratio of 2:1. (Disturbing Case)</li>
                      </ul>
                    </li>
                    <li className="rounded-lg border border-border bg-white/80 p-3">
                      In Radd case, when the total is less than 1, all shares, except the shares of the spouse, should be increased proportionately so that the total share is 1. The spouse shares are strictly fixed. They cannot be increased unless no far relatives are found.
                    </li>
                    <li className="rounded-lg border border-border bg-white/80 p-3">If husband is also a paternal cousin (or his offspring), or an emancipator (or his relative), he should be treated as two individuals and distribution should be made for each (if qualified).</li>
                    <li className="rounded-lg border border-border bg-white/80 p-3">
                      If the deceased left behind a spouse, a father and a mother, but no offspring & multiple siblings, Umar’s calculations need to be applied. (Umar’s Fatawa)
                      <ul className="list-disc list-inside ml-4 mt-2">
                        <li>a. Parents will not get their prescribed share</li>
                        <li>b. Parents will share the remainder with the 2:1 ratio for father & mother</li>
                        <li>c. Multiple siblings can reduce mother’s share so Umar’s case will no longer be valid</li>
                      </ul>
                    </li>
                    <li className="rounded-lg border border-border bg-white/80 p-3">
                      A full brother cannot receive less than the maternal brother
                      <ul className="list-disc list-inside ml-4 mt-2">
                        <li>a. Full brothers should share equally with the maternal siblings. Effectively, full brothers are treated as maternal siblings.</li>
                        <li>b. This doesn’t apply to paternal brother (becoming maternal brother)</li>
                      </ul>
                    </li>
                    <li className="rounded-lg border border-border bg-white/80 p-3">
                      If the deceased did not leave behind a father or offspring, but left behind at least grandfather & siblings, he has a special case
                      <ul className="list-disc list-inside ml-4 mt-2">
                        <li>a. A=1/6 of the estate</li>
                        <li>b. B=1/3 of the remainder of shares</li>
                        <li>c. C=Treat grandfather like a brother and divide the shares equally among them</li>
                        <li>d. The grandfather will be given the maximum of A, B and C</li>
                        <li>e. If the grandfather’s share is causing the total shares to exceed 1, then the regular share of 1/6 will be given and the max of A, B, C rule will be ignored</li>
                        <li>f. If the fractions sum exceeds 1, Awal should be applied; Grandfather’s share is not Ta’seeb in this case.</li>
                        <li>g. During this calculation, Full Sister & paternal sister ‘s share should be excluded (if they are in 2/3rd zone)</li>
                      </ul>
                    </li>
                    <li className="rounded-lg border border-border bg-white/80 p-3">
                      If the deceased did not leave behind a father or offspring or brother, but left behind at least a grandfather and a sister. If a sister gets more than grandfather, then the shares should be readjusted
                      <ul className="list-disc list-inside ml-4 mt-2">
                        <li>a. Discard the prescribed share of the sister</li>
                        <li>b. Sister & grandfather should share the remainder of estate with the ratio 1:2</li>
                      </ul>
                    </li>
                    <li className="rounded-lg border border-border bg-white/80 p-3">Divide the inheritance to non-standard far relatives replacing themselves with the link they are attached to who is qualified for the inheritance.</li>
                    <li className="rounded-lg border border-border bg-white/80 p-3">If there is still a remainder, then the remaining can now be given to the spouse if alive.</li>
                    <li className="rounded-lg border border-border bg-white/80 p-3">If the deceased has obsoletely no relatives, the Islamic state takes the entire estate.</li>
                    <li className="rounded-lg border border-border bg-white/80 p-3">In case of female heirs, the inheritance stops at them and does not move on to their children as in case of male heirs.</li>
                    <li className="rounded-lg border border-border bg-white/80 p-3">In the absence of immediate children, grandchildren replace them as heirs.</li>
                    <li className="rounded-lg border border-border bg-white/80 p-3">
                      <strong>The 2/3 zone</strong>
                      <ul className="list-disc list-inside ml-4 mt-2">
                        <li>a. Certain female relatives can get into this zone</li>
                        <li>b. The 4 possible relatives in this zone are – daughter, paternal granddaughter, full sister, paternal sister</li>
                        <li>c. When a heir is inside this zone, she cannot block any body</li>
                        <li>d. The male sibling of the same class can get her out of the 2/3 zone: Son for the daughter, Paternal grandson for the paternal granddaughter, Full brother for the full sister, Paternal brother for the paternal sister</li>
                        <li>e. Female offspring can never be together with female siblings in the 2/3 zone. The female offspring can get the female siblings out of the 2/3 zone</li>
                        <li>f. Daughter & granddaughter cannot be given the same share when in 2/3 zone. Same applies for full sister & paternal sister. One is given ½ & the other is given 1/6.</li>
                        <li>g. Full brother can get the paternal sister out of 2/3 zone, actually completely blocks her.</li>
                      </ul>
                    </li>
                    <li className="rounded-lg border border-border bg-white/80 p-3">The 2/3 fraction is either for daughter-granddaughter, or, full sister-paternal sister. The 2/3 can never be shared between female offspring & female siblings.</li>
                    <li className="rounded-lg border border-border bg-white/80 p-3">Maternal siblings can reduce mother’s share.</li>
                    <li className="rounded-lg border border-border bg-white/80 p-3">Maternal siblings do not have 1:2 male female ratio.</li>
                    <li className="rounded-lg border border-border bg-white/80 p-3">Father blocks full siblings, paternal siblings, and maternal siblings.</li>
                    <li className="rounded-lg border border-border bg-white/80 p-3">
                      Following relatives can never be blocked:
                      <ul className="list-disc list-inside ml-4 mt-2">
                        <li>Husband</li>
                        <li>Wife</li>
                        <li>Father</li>
                        <li>Mother</li>
                        <li>Son</li>
                        <li>Daughter</li>
                      </ul>
                    </li>
                    <li className="rounded-lg border border-border bg-white/80 p-3">Spouse can neither be blocked, nor can they block any body.</li>
                    <li className="rounded-lg border border-border bg-white/80 p-3">Spouse share can never be increased, even if there are no more standard heirs left. The far relatives are given priority first before increasing spouse’s share.</li>
                    <li className="rounded-lg border border-border bg-white/80 p-3">
                      Role promotion when the person is not alive:
                      <ul className="list-disc list-inside ml-4 mt-2">
                        <li>Grandfather becomes a father</li>
                        <li>Paternal grandmother becomes a mother</li>
                        <li>Granddaughter become a daughter</li>
                        <li>Sister becomes a daughter</li>
                        <li>Paternal sister becomes a daughter</li>
                      </ul>
                    </li>
                    <li className="rounded-lg border border-border bg-white/80 p-3">Maternal grandfather (mother’s father) is blocked from inheritance. His both male & female ancestors are also blocked. This is different from maternal grandmother (mother’s mother). She gets the inheritance. Also, her female ancestors can also get inheritance, but not the male ancestors.</li>
                    <li className="rounded-lg border border-border bg-white/80 p-3">The only female chain that continues indefinitely is mother’s mother’s mother’s ….</li>
                    <li className="rounded-lg border border-border bg-white/80 p-3">There is a difference of opinion on father blocking the father’s mother. However, all agree that a mother can block father’s mother.</li>
                    <li className="rounded-lg border border-border bg-white/80 p-3">There is some difference of opinion on grandfather blocking the siblings.</li>
                    <li className="rounded-lg border border-border bg-white/80 p-3">
                      Following relatives are not qualified for Ta’seeb:
                      <ul className="list-disc list-inside ml-4 mt-2">
                        <li>Mother</li>
                        <li>Paternal grandmother</li>
                        <li>Maternal grandmother</li>
                        <li>Husband</li>
                        <li>Wife</li>
                        <li>Maternal Brother</li>
                        <li>Maternal Sister</li>
                      </ul>
                    </li>
                    <li className="rounded-lg border border-border bg-white/80 p-3">
                      Joint Ta’seebs are possible only for the following cases:
                      <ul className="list-disc list-inside ml-4 mt-2">
                        <li>Son & daughter</li>
                        <li>Grandson & Grand daughter</li>
                        <li>Full brother & full sister</li>
                        <li>Paternal brother & paternal sister</li>
                      </ul>
                    </li>
                  </ol>
                </section>
                <section className="rounded-xl border border-border bg-accent/5 p-5">
                  <h3 className="text-lg font-bold text-primary mb-3">Important Notes</h3>
                  <ul className="list-disc list-inside space-y-2 text-sm leading-6 text-black">
                    <li className="rounded-lg border border-border bg-white/80 p-3">An unborn child is treated as having the same status as a born child.</li>
                    <li className="rounded-lg border border-border bg-white/80 p-3">Non-Muslim relatives are not eligible for inheritance. They might, however, receive the bequeathal.</li>
                  </ul>
                </section>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
