# 🤖 Detector de Objetos IA

Uma aplicação web avançada de detecção e classificação de objetos usando **TensorFlow.js** com múltiplos modelos de inteligência artificial.

## ✨ Funcionalidades

### 🎯 Detecção de Objetos (COCO-SSD)
- Detecta e localiza **80 objetos** do cotidiano
- Desenha bounding boxes coloridas ao redor dos objetos
- Mostra posição exata e nível de confiança
- Objetos: pessoas, veículos, animais, móveis, eletrônicos, alimentos, etc.

### 🧠 Classificação de Imagens (MobileNet)
- Classifica imagens em **1000+ categorias**
- Identifica raças específicas de animais
- Reconhece modelos de veículos
- Detecta tipos específicos de plantas, alimentos e objetos
- Precisão muito alta para categorias específicas

### 🇧🇷 Interface em Português
- **500+ objetos traduzidos** para português brasileiro
- Interface completamente localizada
- Nomes técnicos e populares dos objetos

## 🚀 Tecnologias Utilizadas

- **TensorFlow.js** - Machine Learning no navegador
- **COCO-SSD** - Modelo de detecção de objetos
- **MobileNet** - Modelo de classificação de imagens
- **HTML5 Canvas** - Renderização de bounding boxes
- **CSS3** - Design moderno com glassmorphism
- **JavaScript ES6+** - Lógica da aplicação

## 📁 Estrutura do Projeto

```
detector-objetos-ia/
├── index.html          # Página principal
├── style.css           # Estilos CSS
├── app.js              # Lógica JavaScript
├── page.tsx            # Componente principal (ObjectDetectionApp)
└── README.md           # Documentação
```

## 🛠️ Como Usar

### 1. Instalação
```bash
# Baixe os arquivos

# Abra o index.html em um navegador moderno
# Ou use um servidor local:
python -m http.server 8000
# ou
npx serve .
```

### 2. Utilização
1. **Aguarde** o carregamento dos modelos de IA
2. **Escolha o modelo**:
   - **COCO-SSD**: Para detectar múltiplos objetos com localização
   - **MobileNet**: Para classificar especificamente o que é a imagem
3. **Carregue uma imagem** (clique ou arraste)
4. **Clique em analisar** e veja os resultados!

## 🎨 Recursos Visuais

- **Design Futurista**: Gradientes e efeitos glassmorphism
- **Responsivo**: Funciona em desktop e mobile
- **Animações Suaves**: Transições e hover effects
- **Cores Dinâmicas**: Cada objeto tem cor única
- **Interface Intuitiva**: Fácil de usar e navegar

## 🔒 Privacidade

- **100% Local**: Processamento feito no navegador
- **Sem Upload**: Imagens nunca saem do seu dispositivo
- **Sem Servidor**: Não requer conexão após carregamento inicial
- **Código Aberto**: Totalmente transparente

## 📊 Comparação dos Modelos

| Modelo | Objetos | Tipo | Melhor Para |
|--------|---------|------|-------------|
| **COCO-SSD** | 80 | Detecção + Localização | Múltiplos objetos, segurança, análise de cena |
| **MobileNet** | 1000+ | Classificação | Identificação específica, categorização |

## 🎯 Exemplos de Detecção

### COCO-SSD detecta:
- **Pessoas e animais**: pessoa, gato, cachorro, cavalo, pássaro
- **Veículos**: carro, ônibus, motocicleta, bicicleta, avião
- **Móveis**: cadeira, sofá, mesa, cama, vaso de planta
- **Eletrônicos**: televisão, notebook, celular, mouse, teclado
- **Alimentos**: pizza, banana, maçã, sanduíche, bolo

### MobileNet classifica:
- **Raças específicas**: Golden Retriever, Pastor Alemão, Gato Siamês
- **Modelos de carros**: Ferrari, Lamborghini, Fusca, Jeep
- **Tipos de plantas**: Rosa, Girassol, Carvalho, Pinheiro
- **Objetos específicos**: Violão, Piano, Microscópio, Telescópio

## 🔧 Requisitos Técnicos

- **Navegador moderno** com suporte a ES6+
- **JavaScript habilitado**
- **Conexão com internet** (apenas para carregamento inicial)
- **Mínimo 2GB RAM** recomendado

## 🌟 Funcionalidades Avançadas

- **Drag & Drop**: Arraste imagens diretamente
- **Múltiplos formatos**: JPG, PNG, GIF
- **Tempo de processamento**: Mostra velocidade da análise
- **Bounding boxes coloridas**: Cada objeto tem cor única
- **Confiança em %**: Mostra certeza da detecção
- **Interface adaptativa**: Muda conforme o modelo

## 🚀 Melhorias Futuras

- [ ] Detecção via webcam em tempo real
- [ ] Suporte a vídeos
- [ ] Mais modelos (YOLO, PoseNet)
- [ ] Exportação de resultados
- [ ] Filtros por categoria
- [ ] Modo escuro/claro
- [ ] Histórico de análises

## 📝 Licença

Este projeto é open source e está disponível sob a licença MIT.

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para:
- Reportar bugs
- Sugerir melhorias
- Adicionar novas funcionalidades
- Melhorar traduções

## 📞 Suporte

Para dúvidas ou problemas:
- Abra uma issue no repositório
- Verifique se o navegador suporta WebGL
- Certifique-se de ter conexão estável para carregar os modelos

---

🎯 Desenvolvido por Valber
