
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import { THEMES } from './constants';
import { ColoringTheme } from './types';
import Canvas from './components/Canvas';
import Toolbar from './components/Toolbar';

const PET_IMAGE = "https://i.ibb.co/ycsQ1tKn/1.jpg";
const HERO_DOG_IMAGE = "https://i.ibb.co/cRC1Zyr/cccb4e8da3e9d124ede6eb7a74598fdf.jpg";
const NEW_IMAGE_3 = "https://i.ibb.co/23sG826k/4.jpg";
const NEW_IMAGE_4 = "https://i.ibb.co/Wp2hHzGX/9f4aaa89f30c76aaca49e06d08ae3423.jpg";

const SAMPLE_IMAGES_L = [
  PET_IMAGE,
  "https://i.ibb.co/tP4rnfPG/2.jpg",
  HERO_DOG_IMAGE,
  "https://i.ibb.co/cKKCYBky/3.jpg",
  NEW_IMAGE_3,
  NEW_IMAGE_4,
];

const App: React.FC = () => {
  const [selectedTheme, setSelectedTheme] = useState<ColoringTheme | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentColor, setCurrentColor] = useState('#ef4444');
  
  // Estados para o Upsell
  const [showUpsell, setShowUpsell] = useState(false);
  const [timeLeft, setTimeLeft] = useState(90);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (showUpsell && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [showUpsell, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleBuyBasic = () => {
    setTimeLeft(90);
    setShowUpsell(true);
  };

  const selectCarouselImage = (url: string) => {
    setIsGenerating(false);
    const theme = THEMES.find(t => t.previewUrl === url);
    setSelectedTheme(theme || {
      id: 'carousel-selection',
      name: 'Personagem Inesquecível',
      description: 'Uma arte mágica selecionada da nossa galeria.',
      prompt: 'Coloring page style',
      previewUrl: url
    });
    setGeneratedImage(url);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const generateIllustration = async (theme: ColoringTheme) => {
    setIsGenerating(true);
    setSelectedTheme(theme);
    setGeneratedImage(null);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [{ text: theme.prompt + " Professional coloring page, pure white background, black thick outlines only, no color, high resolution." }]
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1"
          }
        }
      });

      let foundImage = false;
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          setGeneratedImage(`data:image/png;base64,${part.inlineData.data}`);
          foundImage = true;
          break;
        }
      }

      if (!foundImage) throw new Error("Não foi possível gerar.");
    } catch (err) {
      console.error(err);
      setGeneratedImage(theme.previewUrl);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => window.print();

  const clearCanvas = () => {
    const current = generatedImage;
    setGeneratedImage(null);
    setTimeout(() => setGeneratedImage(current), 10);
  };

  return (
    <div className="min-h-screen pb-20 bg-transparent">
      {/* Popup de Upsell */}
      {showUpsell && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-indigo-950/80 backdrop-blur-sm animate-fade-in no-print">
          <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden border-4 border-yellow-400 relative animate-bounce-in">
            <button 
              onClick={() => setShowUpsell(false)}
              className="absolute top-6 right-6 text-indigo-950/40 hover:text-indigo-950 transition-colors"
            >
              <i className="fas fa-times text-2xl"></i>
            </button>
            
            <div className="bg-gradient-to-r from-orange-500 to-yellow-500 p-6 text-center text-white">
              <h4 className="text-xl font-black uppercase tracking-widest mb-1">Oferta Relâmpago! ⚡</h4>
              <p className="font-bold text-white/90">Não feche ainda! Temos um presente especial para você.</p>
            </div>

            <div className="p-8 text-center">
              <div className="mb-6">
                <p className="text-indigo-950 font-black text-lg mb-2">Leve o <span className="text-orange-500 underline">Pack PLUS Vitalício</span> ao invés do básico</p>
                <p className="text-indigo-800/70 font-bold text-sm">De R$ 34,90 por apenas:</p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <span className="text-2xl font-bold text-indigo-400 line-through">R$ 34,90</span>
                  <span className="text-5xl font-black text-green-600">R$ 24,90</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-8 text-left">
                <div className="bg-indigo-50 p-3 rounded-2xl flex items-center gap-2 font-bold text-indigo-900 text-xs">
                  <i className="fas fa-check-circle text-green-500"></i> 100 Desenhos
                </div>
                <div className="bg-indigo-50 p-3 rounded-2xl flex items-center gap-2 font-bold text-indigo-900 text-xs">
                  <i className="fas fa-check-circle text-green-500"></i> Acesso Vitalício
                </div>
                <div className="bg-indigo-50 p-3 rounded-2xl flex items-center gap-2 font-bold text-indigo-900 text-xs">
                  <i className="fas fa-check-circle text-green-500"></i> 30 Desenhos Heróis
                </div>
                <div className="bg-indigo-50 p-3 rounded-2xl flex items-center gap-2 font-bold text-indigo-900 text-xs">
                  <i className="fas fa-check-circle text-green-500"></i> +50 Temáticos
                </div>
              </div>

              <div className="mb-8 p-4 bg-red-50 rounded-2xl border-2 border-dashed border-red-200">
                <p className="text-red-600 font-black text-sm mb-1 uppercase tracking-tighter">Essa oferta expira em:</p>
                <p className="text-3xl font-black text-red-600 font-mono">{formatTime(timeLeft)}</p>
              </div>

              <div className="flex flex-col gap-3">
                <button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-5 rounded-2xl font-black text-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-xl shadow-green-200 animate-pulse">
                  SIM! QUERO O PACK PLUS (R$ 24,90)
                </button>
                <button 
                  onClick={() => setShowUpsell(false)}
                  className="text-indigo-950/40 font-bold hover:text-indigo-950 transition-colors text-sm"
                >
                  Não, prefiro pagar R$ 10,90 por apenas 10 desenhos
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cabeçalho */}
      <header className="vibrant-header py-4 px-6 mb-8 no-print sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-md p-2 rounded-2xl border border-white/30 shadow-lg">
              <i className="fas fa-wand-sparkles text-white text-2xl animate-pulse"></i>
            </div>
            <div>
              <h1 className="text-3xl font-black text-white leading-none tracking-tight">Tia Bela S2</h1>
              <p className="text-white/80 text-xs font-bold uppercase tracking-widest">Temas Inesquecíveis</p>
            </div>
          </div>
          <nav className="flex gap-2">
            <a href="#galeria" className="text-white font-bold hover:bg-orange-400 transition-all px-5 py-2 rounded-full border border-white/20 bg-white/10 text-sm">
              <i className="fas fa-images mr-2"></i>Desenhos
            </a>
            <a href="#loja" className="text-white font-bold hover:bg-emerald-400 transition-all px-5 py-2 rounded-full border border-white/40 bg-white/20 text-sm shadow-xl">
              <i className="fas fa-shopping-cart mr-2"></i>Ofertas
            </a>
          </nav>
        </div>
      </header>

      {!selectedTheme && (
        <div className="no-print mb-16 animate-fade-in">
          <div className="max-w-4xl mx-auto px-4 mb-12 text-center">
             <div className="bg-white/40 p-2 rounded-[3rem] shadow-inner mb-8 border-4 border-yellow-300">
                <div 
                  onClick={() => generateIllustration(THEMES[3])}
                  className="relative group cursor-pointer overflow-hidden rounded-[2.5rem] shadow-2xl border-[12px] border-white transform transition-all duration-500"
                >
                  <img src={HERO_DOG_IMAGE} alt="Capa Tia Bela" className="w-full h-[450px] object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-orange-600/60 to-transparent flex flex-col items-center justify-end pb-12 p-6 text-center">
                     <h2 className="text-white text-5xl font-black mb-6 drop-shadow-xl animate-bounce">Aventure-se com nosso Amigo!</h2>
                     <div className="bg-gradient-to-r from-yellow-400 to-orange-500 px-10 py-5 rounded-full shadow-2xl transform group-hover:scale-110 transition-transform flex items-center gap-4">
                        <span className="text-white font-black text-2xl flex items-center gap-3">
                          <i className="fas fa-paw"></i> COLORIR AGORA
                        </span>
                     </div>
                  </div>
                </div>
             </div>
          </div>

          <div className="text-center mb-6">
            <span className="bg-emerald-500 text-white px-8 py-2 rounded-full font-bold text-sm uppercase tracking-widest shadow-lg">
              Inspirações Mágicas da Tia Bela
            </span>
          </div>
          
          <div className="carousel-container relative py-2 overflow-hidden mb-8">
            <div className="animate-scroll-left flex gap-6 px-6">
              {[...SAMPLE_IMAGES_L, ...SAMPLE_IMAGES_L].map((url, i) => (
                <div key={i} onClick={() => selectCarouselImage(url)} className="w-64 h-72 flex-shrink-0 rounded-[2rem] overflow-hidden shadow-xl border-4 border-white cursor-pointer relative bg-white hover:border-yellow-400 transition-colors">
                  <img src={url} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Seção Persuasiva de Benefícios */}
          <section className="max-w-5xl mx-auto px-6 py-12 mb-12">
            <div className="bg-white/60 backdrop-blur-md rounded-[3rem] p-8 md:p-12 shadow-2xl border-b-8 border-indigo-200 text-center">
              <h2 className="text-4xl font-black text-indigo-950 mb-8 tracking-tight">Por que escolher os desenhos da Tia Bela? 🎨</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                    <i className="fas fa-brain text-orange-500 text-2xl"></i>
                  </div>
                  <h4 className="font-black text-indigo-950 text-xl mb-2">Estimula a Criatividade</h4>
                  <p className="text-indigo-900/70 font-bold leading-relaxed">Desenhos com traços pensados para despertar o lado artístico e a imaginação das crianças.</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                    <i className="fas fa-mobile-alt-slash text-emerald-500 text-2xl"></i>
                  </div>
                  <h4 className="font-black text-indigo-950 text-xl mb-2">Menos Telas, Mais Diversão</h4>
                  <p className="text-indigo-900/70 font-bold leading-relaxed">Uma atividade física e manual que reduz o tempo de exposição passiva a vídeos e tablets.</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mb-4">
                    <i className="fas fa-hand-holding-heart text-sky-500 text-2xl"></i>
                  </div>
                  <h4 className="font-black text-indigo-950 text-xl mb-2">Momento em Família</h4>
                  <p className="text-indigo-900/70 font-bold leading-relaxed">Pintar juntos cria memórias afetivas inesquecíveis e fortalece os laços com seus pequenos.</p>
                </div>
              </div>
              <div className="mt-12 p-6 bg-indigo-50 rounded-[2rem] border-2 border-dashed border-indigo-200">
                <p className="text-indigo-900 font-black text-lg">
                  "Oferecer um papel em branco e um lápis de cor é dar a uma criança o poder de colorir o próprio mundo."
                </p>
              </div>
            </div>
          </section>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4">
        {!selectedTheme ? (
          <>
            <section id="galeria" className="mb-24 mt-12">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-black text-indigo-950 mb-4">Desenhos para Colorir Online</h2>
                <p className="text-indigo-800/70 font-bold text-lg">Clique em um personagem para abrir o caderno.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {THEMES.map((theme, index) => {
                  const colors = ['bg-orange-500', 'bg-emerald-500', 'bg-sky-500', 'bg-pink-500'];
                  return (
                    <div key={theme.id} onClick={() => generateIllustration(theme)} className="glass-panel rounded-[2.5rem] overflow-hidden shadow-xl border-white hover:-translate-y-2 transition-all cursor-pointer bg-white group flex flex-col h-full">
                      <div className="h-64 overflow-hidden relative">
                        <img src={theme.previewUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="p-6 text-center flex flex-col flex-grow">
                        <h3 className="text-xl font-bold text-indigo-950 mb-2">{theme.name}</h3>
                        <button className={`w-full py-3 ${colors[index % colors.length]} text-white rounded-xl font-bold hover:opacity-90 transition-colors mt-auto shadow-lg`}>
                          Abrir {theme.name.split(' ')[0]}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Prova Social de uma Mãe (Sessão 3) */}
            <section className="mb-24 no-print flex flex-col md:flex-row items-center justify-center gap-12">
              <div className="flex-1 max-w-2xl bg-white p-10 rounded-[3rem] shadow-2xl border-4 border-pink-100 flex flex-col items-center text-center relative hover:scale-[1.02] transition-transform order-2 md:order-1">
                <div className="absolute -top-6 bg-pink-500 text-white px-6 py-2 rounded-full font-black text-sm shadow-lg">
                  DEPOIMENTO REAL ❤️
                </div>
                <img src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=150&h=150&auto=format&fit=crop" alt="Ana Luiza" className="w-24 h-24 rounded-full border-4 border-white shadow-xl mb-6 object-cover" />
                <div className="flex gap-1 mb-4 text-yellow-400 text-xl">
                  <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i>
                </div>
                <p className="text-indigo-950 text-xl font-bold italic leading-relaxed mb-6">
                  "O Pedro amou os desenhos! O material em PDF tem uma qualidade incrível, as linhas são bem fortes e fáceis de colorir. Finalmente algo que tira ele do tablet por horas. Valeu cada centavo!"
                </p>
                <div>
                  <h4 className="font-black text-indigo-950">Ana Luiza</h4>
                  <p className="text-indigo-800/50 font-bold text-sm">Mãe do Pedro (4 anos)</p>
                </div>
              </div>
              <div className="flex-shrink-0 w-72 h-72 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white transform rotate-3 order-1 md:order-2">
                 <img src={NEW_IMAGE_3} className="w-full h-full object-cover" alt="Exemplo de arte" />
              </div>
            </section>

            {/* Sessão 4: Destaque de Conteúdo */}
            <section className="mb-24 no-print flex flex-col md:flex-row items-center justify-center gap-12">
               <div className="flex-shrink-0 w-80 h-96 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white transform -rotate-3">
                 <img src={NEW_IMAGE_4} className="w-full h-full object-cover" alt="Novos Temas" />
               </div>
               <div className="flex-1 max-w-xl text-center md:text-left">
                  <span className="bg-orange-500 text-white px-4 py-1 rounded-full font-black text-xs uppercase mb-4 inline-block tracking-tighter">Novidades Inesquecíveis</span>
                  <h3 className="text-4xl font-black text-indigo-950 mb-6 leading-tight">Temas que despertam a imaginação!</h3>
                  <p className="text-indigo-900/70 font-bold text-lg mb-8 leading-relaxed">
                    Nossas artes são criadas pensando no desenvolvimento criativo e na diversão pura. Cada traço é desenhado para ser amigável e fácil de pintar!
                  </p>
                  <a href="#loja" className="inline-block bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-lg shadow-xl hover:bg-indigo-700 transition-all">
                    Ver todos os Packs
                  </a>
               </div>
            </section>

            <section id="loja" className="mb-20">
              <div className="text-center mb-16">
                <h2 className="text-5xl font-black text-indigo-950 mb-4">Packs de Impressão</h2>
                <p className="text-indigo-800/70 font-bold text-xl">Desenhos em PDF de alta qualidade para pintar no papel!</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto mb-16">
                {/* Pack Pocket */}
                <div className="bg-white rounded-[3rem] p-10 shadow-2xl border-4 border-sky-100 flex flex-col items-center text-center relative overflow-hidden group hover:border-sky-400 transition-all">
                  <div className="bg-sky-500 text-white px-6 py-2 rounded-full text-sm font-bold absolute top-6 right-6 uppercase">Essencial</div>
                  <h3 className="text-3xl font-black text-indigo-950 mb-4">Pack Pocket</h3>
                  <p className="text-indigo-800/60 font-bold mb-8">10 desenhos mágicos selecionados para uma diversão rápida e criativa.</p>
                  <div className="mb-8">
                    <div className="flex items-baseline justify-center">
                      <span className="text-2xl font-bold text-indigo-950 mr-1">R$</span>
                      <span className="text-6xl font-black text-indigo-950">10,90</span>
                    </div>
                  </div>
                  <ul className="text-left space-y-3 mb-10 w-full">
                    <li className="flex items-center gap-3 font-bold text-indigo-900"><i className="fas fa-check text-sky-500"></i> 10 Desenhos em HD</li>
                    <li className="flex items-center gap-3 font-bold text-indigo-900"><i className="fas fa-shield-halved text-sky-400"></i> 7 Dias de Garantia</li>
                  </ul>
                  <button 
                    onClick={handleBuyBasic}
                    className="w-full bg-gradient-to-r from-sky-500 to-indigo-500 text-white py-5 rounded-2xl font-black text-xl hover:from-sky-600 hover:to-indigo-600 transition-all shadow-xl"
                  >
                    COMPRAR PACK 10
                  </button>
                </div>

                {/* Pack Plus */}
                <div className="bg-indigo-950 rounded-[3rem] p-10 shadow-2xl border-4 border-pink-500 flex flex-col items-center text-center relative overflow-hidden text-white group hover:scale-105 transition-all">
                  <div className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold absolute top-6 right-6 animate-pulse uppercase">Mega Oferta</div>
                  <h3 className="text-3xl font-black mb-4">Oferta PLUS</h3>
                  <p className="text-indigo-200 font-bold mb-8">O maior acervo da Tia Bela! Diversão para o ano todo.</p>
                  <div className="mb-8">
                    <div className="flex items-baseline justify-center">
                      <span className="text-2xl font-bold mr-1">R$</span>
                      <span className="text-6xl font-black">34,90</span>
                    </div>
                  </div>
                  <ul className="text-left space-y-3 mb-10 w-full">
                    <li className="flex items-center gap-3 font-bold"><i className="fas fa-check text-pink-500"></i> 100 Desenhos no Total</li>
                    <li className="flex items-center gap-3 font-bold"><i className="fas fa-infinity text-orange-400"></i> Acesso VITALÍCIO</li>
                  </ul>
                  <button className="w-full bg-gradient-to-r from-pink-500 to-rose-600 text-white py-5 rounded-2xl font-black text-xl hover:from-pink-600 hover:to-rose-700 transition-all shadow-xl">
                    GARANTIR PACK PLUS
                  </button>
                </div>
              </div>

              {/* Selos de Segurança */}
              <div className="max-w-4xl mx-auto flex flex-wrap justify-center items-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all no-print">
                <div className="flex items-center gap-2 font-bold text-indigo-950">
                  <i className="fas fa-lock text-emerald-500"></i> Pagamento Seguro
                </div>
                <div className="flex items-center gap-2 font-bold text-indigo-950">
                  <i className="fas fa-paper-plane text-sky-500"></i> Entrega Imediata
                </div>
                <div className="flex items-center gap-2 font-bold text-indigo-950">
                  <i className="fas fa-shield-alt text-orange-500"></i> Satisfação Garantida
                </div>
              </div>
            </section>
          </>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-8 animate-fade-in">
            <div className="lg:col-span-3">
              <button 
                onClick={() => { setSelectedTheme(null); setGeneratedImage(null); }}
                className="mb-6 w-full flex items-center justify-center gap-3 bg-white px-6 py-4 rounded-2xl text-indigo-700 font-black hover:bg-orange-50 border-2 border-transparent hover:border-orange-200 shadow-xl transition-all"
              >
                <i className="fas fa-arrow-left"></i> Escolher Outro
              </button>
              <Toolbar currentColor={currentColor} setCurrentColor={setCurrentColor} onClear={clearCanvas} onPrint={handlePrint} />
            </div>
            <div className="lg:col-span-9">
              {isGenerating ? (
                <div className="w-full h-[600px] bg-white rounded-[2.5rem] shadow-2xl flex flex-col items-center justify-center text-center p-12">
                   <div className="w-20 h-20 border-8 border-orange-500 border-t-transparent rounded-full animate-spin mb-6"></div>
                   <h3 className="text-2xl font-black text-indigo-950">Estamos criando seu desenho...</h3>
                </div>
              ) : (
                <Canvas baseImage={generatedImage} color={currentColor} tool="brush" lineWidth={6} />
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="mt-20 py-20 bg-white/40 border-t border-white text-center">
        <span className="text-2xl font-black text-indigo-950">Tia Bela S2</span>
        <p className="text-indigo-900 font-bold opacity-60">Packs de Desenhos em PDF a partir de R$ 10,90 - Diversão garantida!</p>
      </footer>
    </div>
  );
};

export default App;
