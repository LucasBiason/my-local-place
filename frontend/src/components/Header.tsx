/**
 * COMPONENTE: Header
 * 
 * ============================================================================
 * PROPOSITO
 * ============================================================================
 * 
 * Header (cabecalho) da aplicacao. Mostra:
 * - Logo e titulo "MyLocalPlace"
 * - Status de conexao com Docker
 * - Versao da API
 * 
 * ============================================================================
 * CONCEITOS REACT DEMONSTRADOS:
 * ============================================================================
 * 
 * 1. PROPS (Propriedades)
 * 2. TypeScript Types para Props
 * 3. Renderizacao condicional
 * 4. Lucide Icons (biblioteca de icones)
 * 5. TailwindCSS classes
 * 6. Template literals em className
 * 
 * ============================================================================
 * EXEMPLO DE USO:
 * ============================================================================
 * 
 * function App() {
 *   const health = useHealth();
 * 
 *   return <Header health={health} />;
 * }
 */

import { Activity } from 'lucide-react';
import { Logo } from './Logo';
import type { HealthStatus } from '../types';

/**
 * HeaderProps - Tipo das propriedades do componente
 * 
 * CONCEITO: Props sao parametros que componente recebe.
 * Criamos um tipo para definir quais props sao aceitas.
 * 
 * CAMPOS:
 * - health: Pode ser HealthStatus ou null
 * 
 * USO: Garante type safety ao passar props.
 * TypeScript avisa se esquecermos de passar 'health' ou se passar errado.
 */
type HeaderProps = {
  health: HealthStatus | null;
};

/**
 * Componente Header
 * 
 * @param props - Objeto com propriedade 'health'
 * @returns JSX.Element - Header visual
 * 
 * DESTRUCTURING DE PROPS:
 * ({ health }: HeaderProps) eh atalho para:
 * (props: HeaderProps) => { const health = props.health; ... }
 * 
 * BENEFICIO: Acessa diretamente 'health' em vez de 'props.health'
 */
export const Header = ({ health }: HeaderProps) => {
  /**
   * JSX RETORNADO
   * 
   * ESTRUTURA:
   * <header> - Tag semantica HTML5 para cabecalho
   *   <div> - Container centralizado
   *     <div> - Flex row (logo + titulo) e (status)
   *       <div> - Logo + Titulo
   *       {health && <div>} - Status (condicional)
   */
  return (
    <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white shadow-2xl border-b border-blue-700">
      {/*
        TAILWIND CLASSES:
        - bg-gradient-to-r: Gradiente da esquerda para direita
        - from-blue-600 to-blue-800: Cores do gradiente
        - text-white: Texto branco
        - shadow-lg: Sombra grande
      */}
      
      <div className="container mx-auto px-6 py-6">
        {/*
          CONTAINER:
          - container: Largura maxima responsiva
          - mx-auto: Margem horizontal auto (centraliza)
          - px-6: Padding horizontal 1.5rem
          - py-6: Padding vertical 1.5rem
        */}
        
        <div className="flex items-center justify-between">
          {/*
            FLEX LAYOUT:
            - flex: Display flex (layout flexivel)
            - items-center: Alinha verticalmente ao centro
            - justify-between: Espaco entre itens (logo <-> status)
          */}
          
          {/* Logo com design moderno */}
          <Logo />

          {/*
            RENDERIZACAO CONDICIONAL: {health && <div>}
            
            LOGICA:
            - Se health for null/undefined/false: Nao renderiza nada
            - Se health existir (truthy): Renderiza <div>
            
            OPERADOR &&:
            Em JavaScript, 'A && B' retorna:
            - B se A for truthy
            - A se A for falsy
            
            RESULTADO: Status so aparece se health existir (API respondeu)
          */}
          {health && (
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
              {/*
                STATUS CARD:
                - bg-white/10: Fundo branco com 10% opacidade
                - backdrop-blur-sm: Efeito blur no fundo
                - rounded-lg: Bordas arredondadas grandes
                - px-4 py-2: Padding 1rem horizontal, 0.5rem vertical
              */}
              
              {/* 
                ICONE DE STATUS (Activity)
                
                CLASSES DINAMICAS:
                className={`texto fixo ${condicao ? 'classe1' : 'classe2'}`}
                
                TEMPLATE LITERAL (`...`):
                Permite inserir JavaScript com ${}
                
                OPERADOR TERNARIO:
                condicao ? valorSeTrue : valorSeFalse
                
                RESULTADO:
                - Se docker_connected: Icone verde (text-green-300)
                - Se nao conectado: Icone vermelho (text-red-300)
              */}
              <Activity
                className={`w-5 h-5 ${
                  health.docker_connected ? 'text-green-300' : 'text-red-300'
                }`}
              />
              
              <div className="text-sm">
                {/* 
                  TEXTO DE STATUS (dinamico)
                  
                  health.docker_connected ? 'Texto1' : 'Texto2'
                  Mostra texto diferente baseado no status
                */}
                <div className="font-medium">
                  {health.docker_connected ? 'Docker Connected' : 'Docker Offline'}
                </div>
                
                {/* 
                  VERSAO DA API
                  
                  Insere valor de health.version no texto:
                  {health.version} -> "2.0.0" -> "v2.0.0"
                */}
                <div className="text-blue-100 text-xs">v{health.version}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

/**
 * EXPORT NAMED
 * 
 * export const Header = ...
 * Significa: Exporta Header como named export.
 * 
 * IMPORTACAO:
 * import { Header } from './components/Header';
 * 
 * DIFERENCA DE DEFAULT EXPORT:
 * - Named: export const X = ... -> import { X }
 * - Default: export default X -> import X (qualquer nome)
 */
