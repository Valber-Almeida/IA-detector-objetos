"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Camera, Loader2, Zap, Eye, Brain, Settings } from "lucide-react"

// Tipos para TypeScript
interface Detection {
  bbox: [number, number, number, number]
  class: string
  score: number
}

// Modelos disponíveis
const availableModels = {
  "coco-ssd": {
    name: "COCO-SSD",
    description: "80 objetos do cotidiano",
    classes: 80,
  },
  mobilenet: {
    name: "MobileNet",
    description: "1000+ objetos e conceitos",
    classes: 1000,
  },
}

// Mapeamento expandido de objetos para português brasileiro (COCO-SSD + MobileNet)
const objectTranslations: { [key: string]: string } = {
  // COCO-SSD (80 classes)
  person: "pessoa",
  bicycle: "bicicleta",
  car: "carro",
  motorcycle: "motocicleta",
  airplane: "avião",
  bus: "ônibus",
  train: "trem",
  truck: "caminhão",
  boat: "barco",
  "traffic light": "semáforo",
  "fire hydrant": "hidrante",
  "stop sign": "placa de pare",
  "parking meter": "parquímetro",
  bench: "banco",
  bird: "pássaro",
  cat: "gato",
  dog: "cachorro",
  horse: "cavalo",
  sheep: "ovelha",
  cow: "vaca",
  elephant: "elefante",
  bear: "urso",
  zebra: "zebra",
  giraffe: "girafa",
  backpack: "mochila",
  umbrella: "guarda-chuva",
  handbag: "bolsa",
  tie: "gravata",
  suitcase: "mala",
  frisbee: "frisbee",
  skis: "esquis",
  snowboard: "snowboard",
  "sports ball": "bola esportiva",
  kite: "pipa",
  "baseball bat": "taco de baseball",
  "baseball glove": "luva de baseball",
  skateboard: "skate",
  surfboard: "prancha de surf",
  "tennis racket": "raquete de tênis",
  bottle: "garrafa",
  "wine glass": "taça de vinho",
  cup: "xícara",
  fork: "garfo",
  knife: "faca",
  spoon: "colher",
  bowl: "tigela",
  banana: "banana",
  apple: "maçã",
  sandwich: "sanduíche",
  orange: "laranja",
  broccoli: "brócolis",
  carrot: "cenoura",
  "hot dog": "cachorro-quente",
  pizza: "pizza",
  donut: "rosquinha",
  cake: "bolo",
  chair: "cadeira",
  couch: "sofá",
  "potted plant": "vaso de planta",
  bed: "cama",
  "dining table": "mesa de jantar",
  toilet: "vaso sanitário",
  tv: "televisão",
  laptop: "notebook",
  mouse: "mouse",
  remote: "controle remoto",
  keyboard: "teclado",
  "cell phone": "celular",
  microwave: "micro-ondas",
  oven: "forno",
  toaster: "torradeira",
  sink: "pia",
  refrigerator: "geladeira",
  book: "livro",
  clock: "relógio",
  vase: "vaso",
  scissors: "tesoura",
  "teddy bear": "ursinho de pelúcia",
  "hair drier": "secador de cabelo",
  toothbrush: "escova de dente",

  // MobileNet classes adicionais (exemplos mais comuns)
  "Egyptian cat": "gato egípcio",
  "tabby, tabby cat": "gato rajado",
  "tiger cat": "gato tigrado",
  "Persian cat": "gato persa",
  "Siamese cat": "gato siamês",
  "golden retriever": "golden retriever",
  "Labrador retriever": "labrador",
  "German shepherd": "pastor alemão",
  beagle: "beagle",
  boxer: "boxer",
  bulldog: "bulldog",
  poodle: "poodle",
  Chihuahua: "chihuahua",
  "Yorkshire terrier": "yorkshire terrier",
  "border collie": "border collie",
  husky: "husky",
  rottweiler: "rottweiler",
  dalmatian: "dálmata",
  pug: "pug",
  "cocker spaniel": "cocker spaniel",
  "sports car": "carro esportivo",
  convertible: "conversível",
  limousine: "limusine",
  jeep: "jipe",
  minivan: "minivan",
  "pickup truck": "caminhonete",
  ambulance: "ambulância",
  "fire engine": "caminhão de bombeiros",
  "police van": "viatura policial",
  "school bus": "ônibus escolar",
  trolleybus: "ônibus elétrico",
  "moving van": "caminhão de mudança",
  "garbage truck": "caminhão de lixo",
  "tow truck": "guincho",
  "recreational vehicle": "trailer",
  airliner: "avião comercial",
  warplane: "avião de guerra",
  fighter: "caça",
  bomber: "bombardeiro",
  helicopter: "helicóptero",
  "hot air balloon": "balão de ar quente",
  airship: "dirigível",
  glider: "planador",
  parachute: "paraquedas",
  "space shuttle": "ônibus espacial",
  speedboat: "lancha",
  gondola: "gôndola",
  sailboat: "veleiro",
  catamaran: "catamarã",
  yacht: "iate",
  "container ship": "navio cargueiro",
  liner: "transatlântico",
  pirate: "navio pirata",
  "aircraft carrier": "porta-aviões",
  submarine: "submarino",
  wreck: "naufrágio",
  "half track": "semi-lagarta",
  tank: "tanque",
  missile: "míssil",
  bobsled: "bobsled",
  dogsled: "trenó de cachorro",
  "bicycle-built-for-two": "bicicleta dupla",
  "mountain bike": "mountain bike",
  "freight car": "vagão de carga",
  "passenger car": "vagão de passageiros",
  barrow: "carrinho de mão",
  "shopping cart": "carrinho de compras",
  "motor scooter": "scooter",
  forklift: "empilhadeira",
  "electric locomotive": "locomotiva elétrica",
  "steam locomotive": "locomotiva a vapor",
  amphibian: "anfíbio",
  "Model T": "Ford Modelo T",
  racer: "carro de corrida",
  "beach wagon": "perua",
  cab: "táxi",
  taxicab: "táxi",
  "desktop computer": "computador desktop",
  laptop: "laptop",
  tablet: "tablet",
  smartphone: "smartphone",
  iPod: "iPod",
  "web site": "site web",
  "comic book": "história em quadrinhos",
  "crossword puzzle": "palavras cruzadas",
  "street sign": "placa de rua",
  menu: "cardápio",
  plate: "prato",
  guacamole: "guacamole",
  consomme: "consomê",
  "hot pot": "panela quente",
  trifle: "pavê",
  "ice cream": "sorvete",
  "ice lolly": "picolé",
  "French loaf": "baguete",
  bagel: "bagel",
  pretzel: "pretzel",
  cheeseburger: "cheeseburger",
  hotdog: "cachorro-quente",
  "mashed potato": "purê de batata",
  "head cabbage": "repolho",
  artichoke: "alcachofra",
  "bell pepper": "pimentão",
  cardoon: "cardo",
  mushroom: "cogumelo",
  "Granny Smith": "maçã verde",
  strawberry: "morango",
  lemon: "limão",
  fig: "figo",
  pineapple: "abacaxi",
  corn: "milho",
  acorn: "bolota",
  hip: "quadril",
  buckeye: "castanha",
  "coral fungus": "fungo coral",
  agaric: "cogumelo agaric",
  gyromitra: "gyromitra",
  stinkhorn: "falo fedorento",
  earthstar: "estrela da terra",
  "hen-of-the-woods": "maitake",
  bolete: "boleto",
  ear: "orelha",
  "toilet tissue": "papel higiênico",
  cassette: "fita cassete",
  "chain saw": "motosserra",
  church: "igreja",
  palace: "palácio",
  monastery: "mosteiro",
  library: "biblioteca",
  apiary: "apiário",
  boathouse: "casa de barcos",
  barbershop: "barbearia",
  bookshop: "livraria",
  "butcher shop": "açougue",
  confectionery: "confeitaria",
  "shoe shop": "sapataria",
  "tobacco shop": "tabacaria",
  toyshop: "loja de brinquedos",
  fountain: "fonte",
  cliff: "penhasco",
  "coral reef": "recife de coral",
  lakeside: "beira do lago",
  promontory: "promontório",
  sandbar: "banco de areia",
  seashore: "litoral",
  valley: "vale",
  volcano: "vulcão",
  ballpoint: "caneta esferográfica",
  crayon: "giz de cera",
  "felt tip pen": "caneta hidrocor",
  "fountain pen": "caneta tinteiro",
  "pencil box": "estojo",
  "pencil sharpener": "apontador",
  quill: "pena de escrever",
  "rubber eraser": "borracha",
  "paper towel": "papel toalha",
  "facial tissue": "lenço de papel",
  diaper: "fralda",
  "running shoe": "tênis de corrida",
  loafer: "mocassim",
  sandal: "sandália",
  clog: "tamanco",
  "cowboy boot": "bota de cowboy",
  "hiking boot": "bota de trilha",
  "rubber boot": "bota de borracha",
  "ski boot": "bota de esqui",
  snowshoe: "raquete de neve",
  sock: "meia",
  hosiery: "meia-calça",
  miniskirt: "minissaia",
  jean: "jeans",
  cardigan: "cardigã",
  sweater: "suéter",
  sweatshirt: "moletom",
  suit: "terno",
  dress: "vestido",
  kimono: "quimono",
  abaya: "abaya",
  "academic gown": "beca",
  bikini: "biquíni",
  brassiere: "sutiã",
  cloak: "capa",
  "fur coat": "casaco de pele",
  "lab coat": "jaleco",
  raincoat: "capa de chuva",
  "trench coat": "sobretudo",
  poncho: "poncho",
  robe: "roupão",
  apron: "avental",
  "T-shirt": "camiseta",
  jersey: "camisa",
  "Christmas stocking": "meia de Natal",
  sock: "meia",
  "bolo tie": "gravata bolo",
  "bow tie": "gravata borboleta",
  necktie: "gravata",
  scarf: "cachecol",
  stole: "estola",
  "feather boa": "boa de plumas",
  bearskin: "pele de urso",
  bonnet: "touca",
  "cowboy hat": "chapéu de cowboy",
  sombrero: "sombrero",
  "shower cap": "touca de banho",
  "swimming cap": "touca de natação",
  beret: "boina",
  "baseball cap": "boné",
  "football helmet": "capacete de futebol americano",
  "crash helmet": "capacete",
  "hard hat": "capacete de segurança",
  "bathing cap": "touca de banho",
  "swimming cap": "touca de natação",
}

export default function ObjectDetectionApp() {
  const [model, setModel] = useState<any>(null)
  const [mobilenetModel, setMobilenetModel] = useState<any>(null)
  const [selectedModel, setSelectedModel] = useState<"coco-ssd" | "mobilenet">("coco-ssd")
  const [isLoading, setIsLoading] = useState(false)
  const [isModelLoading, setIsModelLoading] = useState(true)
  const [detections, setDetections] = useState<Detection[]>([])
  const [classifications, setClassifications] = useState<any[]>([])
  const [imageUrl, setImageUrl] = useState<string>("")
  const [processingTime, setProcessingTime] = useState<number>(0)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Carregar os modelos
  useEffect(() => {
    const loadModels = async () => {
      try {
        setIsModelLoading(true)
        // Importar TensorFlow.js e modelos dinamicamente
        const tf = await import("@tensorflow/tfjs")
        const cocoSsd = await import("@tensorflow-models/coco-ssd")
        const mobilenet = await import("@tensorflow-models/mobilenet")

        // Configurar backend
        await tf.ready()

        // Carregar modelos
        const [cocoModel, mobileModel] = await Promise.all([cocoSsd.load(), mobilenet.load()])

        setModel(cocoModel)
        setMobilenetModel(mobileModel)
        console.log("Modelos carregados com sucesso!")
      } catch (error) {
        console.error("Erro ao carregar os modelos:", error)
      } finally {
        setIsModelLoading(false)
      }
    }

    loadModels()
  }, [])

  // Função para processar upload de arquivo
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file)
      setImageUrl(url)
      setDetections([])
      setClassifications([])
    }
  }

  // Função para detectar objetos
  const detectObjects = async () => {
    if (!imageRef.current) return

    setIsLoading(true)
    const startTime = performance.now()

    try {
      if (selectedModel === "coco-ssd" && model) {
        // COCO-SSD para detecção de objetos com bounding boxes
        const predictions = await model.detect(imageRef.current)
        setDetections(predictions)
        setClassifications([])
        drawBoundingBoxes(predictions)
      } else if (selectedModel === "mobilenet" && mobilenetModel) {
        // MobileNet para classificação de imagem completa
        const predictions = await mobilenetModel.classify(imageRef.current)
        setClassifications(predictions)
        setDetections([])
        // Limpar canvas para MobileNet
        const canvas = canvasRef.current
        if (canvas) {
          const ctx = canvas.getContext("2d")
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
          }
        }
      }

      const endTime = performance.now()
      setProcessingTime(endTime - startTime)
    } catch (error) {
      console.error("Erro na detecção:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Função para desenhar bounding boxes no canvas (apenas COCO-SSD)
  const drawBoundingBoxes = (predictions: Detection[]) => {
    const canvas = canvasRef.current
    const image = imageRef.current
    if (!canvas || !image) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Configurar canvas com as dimensões da imagem
    canvas.width = image.naturalWidth
    canvas.height = image.naturalHeight

    // Limpar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Cores vibrantes para diferentes objetos
    const colors = [
      "#FF6B6B",
      "#4ECDC4",
      "#45B7D1",
      "#96CEB4",
      "#FFEAA7",
      "#DDA0DD",
      "#98D8C8",
      "#F7DC6F",
      "#BB8FCE",
      "#85C1E9",
    ]

    // Desenhar cada detecção
    predictions.forEach((prediction, index) => {
      const [x, y, width, height] = prediction.bbox
      const score = Math.round(prediction.score * 100)
      const color = colors[index % colors.length]

      // Configurar estilo
      ctx.strokeStyle = color
      ctx.lineWidth = 4
      ctx.fillStyle = color
      ctx.font = "bold 16px Inter, Arial, sans-serif"

      // Desenhar bounding box
      ctx.strokeRect(x, y, width, height)

      // Desenhar label com fundo
      const translatedClass = objectTranslations[prediction.class] || prediction.class
      const label = `${translatedClass} (${score}%)`
      const textMetrics = ctx.measureText(label)
      const textHeight = 24

      // Fundo do texto com gradiente
      const gradient = ctx.createLinearGradient(x, y - textHeight, x, y)
      gradient.addColorStop(0, color)
      gradient.addColorStop(1, color + "CC")

      ctx.fillStyle = gradient
      ctx.fillRect(x, y - textHeight, textMetrics.width + 16, textHeight)

      // Texto
      ctx.fillStyle = "#FFFFFF"
      ctx.fillText(label, x + 8, y - 6)
    })
  }

  // Função para acionar upload
  const triggerFileUpload = () => {
    fileInputRef.current?.click()
  }

  // Função para traduzir nome do objeto
  const translateObject = (objectName: string): string => {
    return objectTranslations[objectName] || objectName
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(156, 146, 172, 0.3) 1px, transparent 0)`,
            backgroundSize: "30px 30px",
          }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mb-6 shadow-2xl">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
            Detector de Objetos IA
          </h1>
          <p className="text-xl text-gray-300 mb-6">Inteligência Artificial Avançada - Múltiplos Modelos</p>

          {/* Seletor de Modelo */}
          <div className="inline-flex bg-white/10 backdrop-blur-sm rounded-full p-1 border border-white/20 mb-6">
            <button
              onClick={() => setSelectedModel("coco-ssd")}
              className={`px-6 py-2 rounded-full transition-all duration-300 ${
                selectedModel === "coco-ssd"
                  ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-lg"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              COCO-SSD (80 objetos)
            </button>
            <button
              onClick={() => setSelectedModel("mobilenet")}
              className={`px-6 py-2 rounded-full transition-all duration-300 ${
                selectedModel === "mobilenet"
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              MobileNet (1000+ objetos)
            </button>
          </div>

          {isModelLoading && (
            <div className="inline-flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
              <Loader2 className="animate-spin mr-3 text-cyan-400" size={20} />
              <span className="text-white font-medium">Carregando modelos de IA...</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Painel de Upload */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-white text-xl">
                <div className="p-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg">
                  <Upload className="w-5 h-5 text-white" />
                </div>
                Upload de Imagem
              </CardTitle>
            </CardHeader>
            <CardContent>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />

              {/* Info do modelo selecionado */}
              <div className="mb-4 p-3 bg-gradient-to-r from-indigo-500/20 to-purple-600/20 rounded-lg border border-indigo-400/30">
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-indigo-400" />
                  <span className="text-indigo-300 font-medium">
                    Modelo: {availableModels[selectedModel].name} - {availableModels[selectedModel].description}
                  </span>
                </div>
              </div>

              <div
                onClick={triggerFileUpload}
                className="border-2 border-dashed border-cyan-400/50 rounded-xl p-12 text-center cursor-pointer hover:border-cyan-400 hover:bg-white/5 transition-all duration-300 group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Camera className="w-8 h-8 text-white" />
                </div>
                <p className="text-white text-lg font-medium mb-2">Clique para selecionar uma imagem</p>
                <p className="text-gray-300">Suporta JPG, PNG, GIF até 10MB</p>
              </div>

              {imageUrl && (
                <div className="mt-6">
                  <div className="relative rounded-xl overflow-hidden shadow-2xl">
                    <img
                      ref={imageRef}
                      src={imageUrl || "/placeholder.svg"}
                      alt="Imagem carregada"
                      className="w-full"
                      onLoad={() => {
                        // Configurar canvas quando imagem carregar
                        const canvas = canvasRef.current
                        const image = imageRef.current
                        if (canvas && image) {
                          canvas.width = image.naturalWidth
                          canvas.height = image.naturalHeight
                        }
                      }}
                    />
                    <canvas
                      ref={canvasRef}
                      className="absolute top-0 left-0 w-full h-full"
                      style={{ pointerEvents: "none" }}
                    />
                  </div>

                  <Button
                    onClick={detectObjects}
                    disabled={isLoading || isModelLoading || (!model && !mobilenetModel)}
                    className="w-full mt-6 h-14 text-lg font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 border-0 shadow-xl hover:shadow-2xl transition-all duration-300"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="animate-spin mr-3 w-5 h-5" />
                        Analisando com IA...
                      </>
                    ) : (
                      <>
                        <Eye className="mr-3 w-5 h-5" />
                        {selectedModel === "coco-ssd" ? "Detectar Objetos" : "Classificar Imagem"}
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Painel de Resultados */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-white text-xl">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                Resultados da {selectedModel === "coco-ssd" ? "Detecção" : "Classificação"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {processingTime > 0 && (
                <div className="mb-6 p-4 bg-gradient-to-r from-green-400/20 to-blue-500/20 rounded-xl border border-green-400/30">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-green-400" />
                    <p className="text-green-300 font-medium">
                      Processamento concluído em {processingTime.toFixed(0)}ms
                    </p>
                  </div>
                </div>
              )}

              {/* Resultados COCO-SSD */}
              {selectedModel === "coco-ssd" && detections.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="font-bold text-white text-lg">Objetos Detectados</h3>
                    <span className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white text-sm font-medium">
                      {detections.length}
                    </span>
                  </div>

                  <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                    {detections.map((detection, index) => {
                      const colors = [
                        "from-red-400 to-pink-500",
                        "from-cyan-400 to-blue-500",
                        "from-green-400 to-emerald-500",
                        "from-yellow-400 to-orange-500",
                        "from-purple-400 to-indigo-500",
                        "from-pink-400 to-rose-500",
                        "from-teal-400 to-cyan-500",
                        "from-orange-400 to-red-500",
                        "from-indigo-400 to-purple-500",
                        "from-emerald-400 to-green-500",
                      ]
                      const colorClass = colors[index % colors.length]

                      return (
                        <div
                          key={index}
                          className={`flex justify-between items-center p-4 bg-gradient-to-r ${colorClass} rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
                        >
                          <span className="font-bold text-white text-lg">{translateObject(detection.class)}</span>
                          <span className="text-white/90 font-medium bg-white/20 px-3 py-1 rounded-full">
                            {Math.round(detection.score * 100)}%
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Resultados MobileNet */}
              {selectedModel === "mobilenet" && classifications.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="font-bold text-white text-lg">Classificações</h3>
                    <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full text-white text-sm font-medium">
                      Top {classifications.length}
                    </span>
                  </div>

                  <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                    {classifications.map((classification, index) => {
                      const colors = [
                        "from-purple-400 to-pink-500",
                        "from-indigo-400 to-purple-500",
                        "from-blue-400 to-indigo-500",
                        "from-cyan-400 to-blue-500",
                        "from-teal-400 to-cyan-500",
                      ]
                      const colorClass = colors[index % colors.length]

                      return (
                        <div
                          key={index}
                          className={`flex justify-between items-center p-4 bg-gradient-to-r ${colorClass} rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
                        >
                          <span className="font-bold text-white text-lg">
                            {translateObject(classification.className)}
                          </span>
                          <span className="text-white/90 font-medium bg-white/20 px-3 py-1 rounded-full">
                            {Math.round(classification.probability * 100)}%
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Estado vazio */}
              {detections.length === 0 && classifications.length === 0 && (
                <div className="text-center text-gray-300 py-12">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-full mb-6">
                    <Camera className="w-10 h-10 opacity-50" />
                  </div>
                  <p className="text-lg mb-2">Aguardando análise</p>
                  <p className="text-gray-400">
                    Carregue uma imagem e clique em "
                    {selectedModel === "coco-ssd" ? "Detectar Objetos" : "Classificar Imagem"}"
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Informações Técnicas */}
        <Card className="mt-8 bg-white/5 backdrop-blur-lg border-white/10 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white text-2xl text-center">Modelos de IA Disponíveis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-xl border border-cyan-400/30">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mb-4">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold text-white mb-3">COCO-SSD</h4>
                <p className="text-gray-300 text-sm leading-relaxed mb-3">
                  Detecta e localiza 80 objetos do cotidiano com bounding boxes precisas
                </p>
                <div className="text-xs text-cyan-300">
                  Pessoas, veículos, animais, móveis, eletrônicos, alimentos, etc.
                </div>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-xl border border-purple-400/30">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold text-white mb-3">MobileNet</h4>
                <p className="text-gray-300 text-sm leading-relaxed mb-3">
                  Classifica imagens em mais de 1000 categorias diferentes com alta precisão
                </p>
                <div className="text-xs text-purple-300">
                  Raças de animais, modelos de carros, tipos de plantas, objetos específicos, etc.
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-green-500/20 to-emerald-600/20 rounded-xl border border-green-400/30">
              <div className="text-center">
                <Zap className="w-8 h-8 mx-auto mb-2 text-green-400" />
                <h4 className="font-bold text-white mb-2">Processamento Local & Privado</h4>
                <p className="text-gray-300 text-sm">
                  Toda análise é feita localmente no seu navegador. Suas imagens nunca são enviadas para servidores
                  externos.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #06b6d4, #3b82f6);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #0891b2, #2563eb);
        }
      `}</style>
    </div>
  )
}
