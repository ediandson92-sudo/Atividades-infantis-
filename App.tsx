
import React, { useState, useEffect } from 'react';
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

  const handleBuy = () => {
    // Redirecionando para o link fornecido da Kiwify
    window.location.href = "https://pay.kiwify.com.br/uzZIJMr";
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
              <i className="fas fa-shopping-cart mr-2"></i>Oferta Única
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

            <section id="loja" className="mb-20">
              <div className="text-center mb-16">
                <h2 className="text-5xl font-black text-indigo-950 mb-4">Pack Especial de Impressão</h2>
                <p className="text-indigo-800/70 font-bold text-xl">Leve todos os nossos desenhos em PDF de alta qualidade!</p>
              </div>

              <div className="max-w-2xl mx-auto mb-16">
                <div className="bg-indigo-950 rounded-[3rem] p-10 shadow-2xl border-4 border-pink-500 flex flex-col items-center text-center relative overflow-hidden text-white group hover:scale-105 transition-all">
                  <div className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold absolute top-6 right-6 animate-pulse uppercase">OFERTA LIMITADA</div>
                  <h3 className="text-4xl font-black mb-4">Oferta PLUS Vitalícia</h3>
                  <p className="text-indigo-200 font-bold text-lg mb-8">O maior acervo da Tia Bela! Diversão inesquecível para o ano todo.</p>
                  <div className="mb-8">
                    <div className="flex items-baseline justify-center">
                      <span className="text-2xl font-bold mr-1">R$</span>
                      <span className="text-7xl font-black">24,90</span>
                    </div>
                    <p className="text-pink-400 font-bold mt-2">Acesso imediato após o pagamento</p>
                  </div>
                  <ul className="text-left space-y-4 mb-10 w-full max-w-md">
                    <li className="flex items-center gap-3 font-bold text-lg"><i className="fas fa-check-circle text-pink-500 text-2xl"></i> 25 Desenhos Exclusivos</li>
                    <li className="flex items-center gap-3 font-bold text-lg bg-white/10 p-3 rounded-2xl border border-pink-500/30">
                      <i className="fas fa-gift text-yellow-400 text-2xl"></i> 
                      <span><span className="text-yellow-400 font-black">BÔNUS:</span> +5 Desenhos Grátis!</span>
                    </li>
                    <li className="flex items-center gap-3 font-bold text-lg"><i className="fas fa-file-pdf text-sky-400 text-2xl"></i> Formato PDF pronto para Imprimir</li>
                    <li className="flex items-center gap-3 font-bold text-lg"><i className="fas fa-infinity text-orange-400 text-2xl"></i> Acesso VITALÍCIO</li>
                  </ul>
                  <button 
                    onClick={handleBuy}
                    className="w-full bg-gradient-to-r from-pink-500 to-rose-600 text-white py-6 rounded-2xl font-black text-2xl hover:from-pink-600 hover:to-rose-700 transition-all shadow-xl shadow-pink-900/50"
                  >
                    QUERO O PACK + BÔNUS
                  </button>
                </div>
              </div>

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
        <p className="text-indigo-900 font-bold opacity-60">Pack com 25 + 5 Desenhos Bônus por apenas R$ 24,90 - Diversão garantida!</p>
      </footer>
    </div>
  );
};

export default App;
