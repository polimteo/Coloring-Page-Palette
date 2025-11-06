import React, { useCallback } from 'react';
import { useAppContext } from './contexts/AppContext';
import { Header, Footer } from './components/layout/index';
import { ImageUploadSection, PaletteSelector, ColoringControls, ImageComparison } from './components/features/index';
import { ErrorMessage, LoadingSpinner, Button } from './components/common/index';

function AppContent() {
  const { state, dispatch, resetApp } = useAppContext();

  const handlePaletteSelect = useCallback((palette: any) => {
    dispatch({ type: 'SELECT_PALETTE', payload: palette });
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="container mx-auto px-4 py-8 flex-grow">
        {!state.originalImage ? (
          <div className="text-center">
            <ImageUploadSection />
          </div>
        ) : null}

        {state.isLoadingPalettes && (
          <div className="mt-8 flex justify-center">
            <LoadingSpinner message="Analyzing your image and crafting palettes..." size="md" />
          </div>
        )}

        {state.error && (
          <ErrorMessage
            error={state.error}
            onDismiss={() => dispatch({ type: 'SET_ERROR', payload: null })}
          />
        )}

        {state.originalImage && !state.isLoadingPalettes && !state.error && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            <aside className="lg:col-span-1 flex flex-col gap-10">
              <PaletteSelector onPaletteSelect={handlePaletteSelect} />

              <div className="border-t border-gray-200 pt-6">
                <ColoringControls />
              </div>

              <div className="border-t border-gray-200 pt-6">
                <Button
                  onClick={resetApp}
                  variant="secondary"
                  size="md"
                  className="w-full"
                >
                  Upload Another Image
                </Button>
              </div>
            </aside>

            <section className="lg:col-span-2">
              <ImageComparison />
            </section>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export function App() {
  return (
    <div className="font-sans text-gray-800">
      <AppContent />
    </div>
  );
}

export default App;
