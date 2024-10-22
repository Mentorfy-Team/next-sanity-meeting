import clsx from 'clsx';
import {
  useBackgroundFilters,
  VideoPreview,
} from '@stream-io/video-react-sdk';
import { X, Check } from 'lucide-react'; // Adicionado o ícone Check
import { Button } from '../ui/button';

export const VideoEffectsSettings = () => {
  const {
    isSupported,
    backgroundImages,
    backgroundBlurLevel,
    backgroundImage,
    backgroundFilter,
    disableBackgroundFilter,
    applyBackgroundBlurFilter,
    applyBackgroundImageFilter,
  } = useBackgroundFilters();

  if (!isSupported) {
    return (
      <div className="rd__video-effects">
        <h3>Navegador não suportado</h3>
        <p>Filtros de vídeo estão disponíveis apenas em navegadores desktop modernos</p>
      </div>
    );
  }

  return (
    <div className="rd__video-effects">
      <div className="rd__video-effects__preview-container rounded-md overflow-hidden">
        <VideoPreview />
      </div>
      <div className="rd__video-effects__container">
        <div className="rd__video-effects__card mb-4 mt-4">
          <h4>Nivel de Desfoque</h4>
          <div className="flex gap-2 mt-1">
            <Button
              title="Desativar"
              className={`w-10 h-10 bg-slate-500 p-0 rounded-md overflow-hidden transition-all duration-300 relative ${!backgroundFilter ? 'border-2 border-green-400 shadow-md shadow-green-300/50' : ''}`}
              onClick={() => disableBackgroundFilter()}
            >
              <X className="w-6 h-6" />
              {!backgroundFilter && (
                <div className="absolute bottom-0 right-0 bg-green-500 rounded-full p-0.5">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </Button>
            <Button
              title="Desfoque Baixo"
              className={`w-10 h-10 p-0 rounded-md overflow-hidden transition-all duration-300 relative`}
              onClick={() => applyBackgroundBlurFilter('low')}
            >
              <img src="/images/bg/blur-low.jpg" alt="Blur Low" />
              {backgroundFilter === 'blur' && backgroundBlurLevel === 'low' && (
                <div className="absolute bottom-0 right-0 bg-green-500 rounded-full p-0.5">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </Button>
            <Button
              title="Desfoque Alto"
              className={`w-10 h-10 p-0 rounded-md overflow-hidden transition-all duration-300 relative`}
              onClick={() => applyBackgroundBlurFilter('high')}
            >
              <img src="/images/bg/blur-high.jpg" alt="Blur High" />
              {backgroundFilter === 'blur' && backgroundBlurLevel === 'high' && (
                <div className="absolute bottom-0 right-0 bg-green-500 rounded-full p-0.5">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </Button>
          </div>
        </div>
        {backgroundImages && backgroundImages.length > 0 && (
          <div className="rd__video-effects__card">
            <h4>Planos de Fundo</h4>
            <div className="mt-1 flex overflow-x-auto overflow-y-hidden custom-scrollbar">
              {backgroundImages.map((imageUrl) => (
                <div key={imageUrl} className="rd__video-effects__list-box flex-shrink-0 mr-2 relative">
                  <img
                    className={clsx(
                      'rd__video-effects__image cursor-pointer hover:scale-105 transition-all duration-300',
                    )}
                    src={imageUrl}
                    alt="Background"
                    onClick={() => {
                      applyBackgroundImageFilter(imageUrl);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        applyBackgroundImageFilter(imageUrl);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                  />
                  {backgroundFilter === 'image' && backgroundImage === imageUrl && (
                    <div className="absolute bottom-1 right-1 bg-green-500 rounded-full p-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
