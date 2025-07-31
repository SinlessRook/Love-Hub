"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Heart,
  Sparkles,
  Brain,
  Zap,
  Users,
  Star,
  Play,
  RefreshCw,
  Share2,
  Twitter,
  Facebook,
  Instagram,
  Copy,
  ArrowRight,
  ArrowLeft,
  Flame,
  Moon,
  Sun,
  MessageCircle,
} from "lucide-react"

type Interest = {
  name: string
  icon: string
  color: string
}

type Traits = {
  personality: string
  lifestyle: string
  interests: string[]
  values: string
  quirks: string
  gender: string
}

type Preferences = {
  ageRange: [number, number]
  creativity: [number]
  intelligence: [number]
  humor: [number]
  adventure: [number]
}

type GeneratedMatch = {
  name: string
  compatibility: number
  traits: string[]
  description: string
}

export default function LoveHub() {


  const [step, setStep] = useState<number>(1)
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [traits, setTraits] = useState<Traits>({
    personality: "",
    lifestyle: "",
    interests: [],
    values: "",
    quirks: "",
    gender: "",
  })
  const [preferences, setPreferences] = useState<Preferences>({
    ageRange: [25, 35],
    creativity: [50],
    intelligence: [50],
    humor: [50],
    adventure: [50],
  })
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [generatedMatch, setGeneratedMatch] = useState<GeneratedMatch | null>(null)
  const [imageUrl, setImageUrl] = useState<string>("")
  const [imageLoading, setImageLoading] = useState<boolean>(false)
  const [showShareMenu, setShowShareMenu] = useState<boolean>(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 100, behavior: "smooth" })
  }, [step])

  // Generate text using Pollinations API
  const generateText = async (prompt: string): Promise<string> => {
    try {
      const encodedPrompt = encodeURIComponent(prompt)
      const seed = Math.floor(Math.random() * 10000)
      const response = await fetch(`https://text.pollinations.ai/${encodedPrompt}?seed=${seed}`,)
      const text = await response.text()
      return text.trim()
    } catch (error) {
      console.error("Error generating text:", error)
      return ""
    }
  }

  // Generate image using Pollinations API without watermark
  const generateImage = async (prompt: string): Promise<void> => {
    setImageLoading(true)
    try {
      const encodedPrompt = encodeURIComponent(prompt)
      const seed = Math.floor(Math.random() * 10000)
      const imageApiUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=600&seed=${seed}&nologo=true&enhance=true`

      setImageUrl(imageApiUrl)
      setImageLoading(false)
    } catch (error) {
      console.error("Error generating image:", error)
      setImageLoading(false)
    }
  }

  // Create image prompt based on user inputs
  const createImagePrompt = (): string => {
    const ageDesc =
      preferences.ageRange[0] === preferences.ageRange[1]
        ? `${preferences.ageRange[0]} years old`
        : `${preferences.ageRange[0]}-${preferences.ageRange[1]} years old`

    const genderDesc = traits.gender ? `${traits.gender} ` : ""
    const personalityDesc = getPersonalityDescription()
    const interestsDesc = traits.interests.join(", ")

    return `Professional headshot portrait of an attractive ${genderDesc}person, ${ageDesc}, ${personalityDesc}, interested in ${interestsDesc}, ${traits.quirks}, warm genuine smile, professional studio lighting, photorealistic, high quality, 4k, no watermark, clean background`
  }

  const getPersonalityDescription = (): string => {
    const personalityMap: Record<string, string> = {
      extrovert: "outgoing and social",
      introvert: "thoughtful and introspective",
      ambivert: "balanced and adaptable",
    }
    return personalityMap[traits.personality] || traits.personality
  }

  const createNamePrompt = (): string => {
    const genderHint = traits.gender === "male" ? "masculine"
      : traits.gender === "female" ? "feminine" : "gender-neutral";

    const styles = [
      "modern and trendy",
      "classic and timeless",
      "unique and memorable",
      "international and exotic"
    ];

    const randomStyle = styles[Math.floor(Math.random() * styles.length)];

    return `Generate a single ${genderHint} first name that is ${randomStyle}. 
    The name should be attractive and approachable. 
    Return only the name, nothing else. 
    Make it completely random and unique. 
    Current timestamp: ${Date.now()}`;
  };

  const createDescriptionPrompt = (): string => {
    const personalityDesc = getPersonalityDescription();
    const interestsDesc = traits.interests.join(", ");

    const tones = [
      "warm and romantic",
      "fun and playful",
      "sincere and heartfelt",
      "mysterious and intriguing"
    ];

    const randomTone = tones[Math.floor(Math.random() * tones.length)];

    return `Write a 1-2 sentence dating profile description of someone who is ${personalityDesc}, 
    loves ${interestsDesc}, values ${traits.values}, and has these qualities: ${traits.quirks}. 
    Make it sound ${randomTone}. 
    Be creative but not overly poetic. 
    Include one unique, specific detail. 
    Current timestamp: ${Date.now()}`;
  };

  const handleGenerate = async (): Promise<void> => {
    setIsGenerating(true)

    try {
      // Generate name and description using AI
      const [generatedName, generatedDescription] = await Promise.all([
        generateText(createNamePrompt()),
        generateText(createDescriptionPrompt()),
      ])

      // Create match data
      const match: GeneratedMatch = {
        name: generatedName || "Alex",
        compatibility: Math.floor(Math.random() * 20) + 80,
        traits: generateTraits(),
        description: generatedDescription || "A wonderful person with an amazing personality.",
      }

      setGeneratedMatch(match)

      // Generate the image
      const imagePrompt = createImagePrompt()
      await generateImage(imagePrompt)

      setIsGenerating(false)
      setStep(4)
    } catch (error) {
      console.error("Error in generation process:", error)
      setIsGenerating(false)
    }
  }

  const generateTraits = (): string[] => {
    const allTraits = [
      "Creative",
      "Adventurous",
      "Intellectual",
      "Empathetic",
      "Witty",
      "Passionate",
      "Thoughtful",
      "Spontaneous",
      "Artistic",
      "Analytical",
    ]
    return allTraits.sort(() => 0.5 - Math.random()).slice(0, 4)
  }

  const regenerateImage = async (): Promise<void> => {
    if (generatedMatch) {
      const prompt = createImagePrompt()
      await generateImage(prompt)
    }
  }

  const regenerateNameAndDescription = async (): Promise<void> => {
    if (generatedMatch) {
      setImageLoading(true);
      try {
        // Add delay to ensure different results
        await new Promise(resolve => setTimeout(resolve, 300));

        const [newName, newDescription] = await Promise.all([
          generateText(createNamePrompt()),
          generateText(createDescriptionPrompt()),
        ]);

        setGeneratedMatch({
          ...generatedMatch,
          name: newName || `Match-${Math.floor(Math.random() * 1000)}`,
          description: newDescription || `A unique individual with ${traits.interests[0]} passion`,
        });
      } catch (error) {
        console.error("Error regenerating text:", error);
        // Add fallback randomization
        setGeneratedMatch({
          ...generatedMatch,
          name: `User-${Math.floor(Math.random() * 10000)}`,
          description: `Special person who shares your interest in ${traits.interests[Math.floor(Math.random() * traits.interests.length)]}`
        });
      }
      setImageLoading(false);
    }
  };

  // Social sharing functions
  const shareToTwitter = (): void => {
    const text = `I found my perfect match on LoveHub! ${generatedMatch?.compatibility}% compatibility with ${generatedMatch?.name} 💕`
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`
    window.open(url, "_blank")
  }

  const shareToFacebook = (): void => {
    const text = `Check out my AI-generated soulmate on LoveHub! ${generatedMatch?.compatibility}% compatibility with ${generatedMatch?.name}`
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(text)}`
    window.open(url, "_blank")
  }

  const shareToWhatsApp = (): void => {
    const text = `I found my perfect match on LoveHub! ${generatedMatch?.compatibility}% compatibility with ${generatedMatch?.name} 💕 ${window.location.href}`
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`
    window.open(url, "_blank")
  }

  const shareToInstagram = (): void => {
    const text = `Check out my AI-generated soulmate on LoveHub! ${generatedMatch?.compatibility}% compatibility 💕 ${window.location.href}`
    navigator.clipboard.writeText(text).then(() => {
      // Try to open Instagram app if on mobile
      if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
        window.open(`instagram://library?AssetPath=${encodeURIComponent(text)}`)
        setTimeout(() => {
          window.location.href = "https://www.instagram.com/"
        }, 500)
      } else {
        alert("Link copied! You can now paste it in your Instagram story or bio.")
      }
    })
  }

  const copyToClipboard = (): void => {
    const text = `Check out my AI-generated soulmate on LoveHub! ${generatedMatch?.compatibility}% compatibility with ${generatedMatch?.name} 💕 ${window.location.href}`
    navigator.clipboard.writeText(text).then(() => {
      // Show a toast notification instead of alert for better UX
      const toast = document.createElement('div')
      toast.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in-out'
      toast.textContent = 'Link copied to clipboard!'
      document.body.appendChild(toast)

      setTimeout(() => {
        toast.remove()
      }, 3000)
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)

      alert('Link copied to clipboard!')
    })
  }

  const handleInterestChange = (interest: string, checked: boolean): void => {
    if (checked) {
      setTraits({ ...traits, interests: [...traits.interests, interest] })
    } else {
      setTraits({ ...traits, interests: traits.interests.filter((i) => i !== interest) })
    }
  }

  const nextStep = (): void => {
    setIsVisible(false)
    setTimeout(() => {
      setStep(step + 1)
      setIsVisible(true)
    }, 300)
  }

  const prevStep = (): void => {
    setIsVisible(false)
    setTimeout(() => {
      setStep(step - 1)
      setIsVisible(true)
    }, 300)
  }

  // Floating hearts animation
  const FloatingHearts: React.FC = () => (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {[...Array(6)].map((_, i) => (
        <Heart
          key={i}
          className={`absolute text-pink-500/20 animate-bounce`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${3 + Math.random() * 2}s`,
          }}
          size={16 + Math.random() * 8}
        />
      ))}
    </div>
  )

  // Image component using direct API
  const SoulmateImage: React.FC = () => {
    if (imageLoading) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-orange-500/20 rounded-2xl backdrop-blur-sm">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center animate-spin">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <p className="text-white/90 text-lg font-medium animate-pulse">Creating magic...</p>
            <p className="text-white/70 text-sm mt-1">Neural networks at work</p>
          </div>
        </div>
      )
    }

    if (!imageUrl) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-orange-500/20 rounded-2xl backdrop-blur-sm">
          <div className="text-center">
            <div className="relative">
              <Heart className="w-20 h-20 text-pink-400/60 mx-auto mb-3 animate-pulse" />
              <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-2 -right-2 animate-ping" />
            </div>
            <p className="text-white/70 text-lg">Awaiting your soulmate...</p>
          </div>
        </div>
      )
    }

    return (
      <div className="relative w-full h-full group overflow-hidden rounded-2xl">
        <img
          src={imageUrl || "/placeholder.svg"}
          alt="Your AI-generated soulmate"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          crossOrigin="anonymous"
          onLoad={() => setImageLoading(false)}
          onError={() => {
            console.error("Image failed to load")
            setImageLoading(false)
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
          <div className="flex items-center justify-between">
            <div className="text-white">
              <p className="text-sm font-medium">✨ AI Generated</p>
              <p className="text-xs text-white/80">LoveHub Neural Engine</p>
            </div>
            <Button
              size="sm"
              onClick={regenerateImage}
              className="bg-white/20 hover:bg-white/30 text-white border-0 h-10 px-4 backdrop-blur-sm rounded-full transition-all duration-300 hover:scale-105"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
            <Flame className="w-5 h-5 text-orange-400 animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <FloatingHearts />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Header */}
      <header className="relative z-10 backdrop-blur-sm bg-black/20 border-b border-white/10">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-300">
                  <Play className="w-7 h-7 text-white ml-1" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-orange-400 bg-clip-text text-transparent">
                  LoveHub
                </h1>
                <p className="text-white/70 text-sm font-medium">AI-Powered Soulmate Generator</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-white/80">
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Heart className="w-5 h-5 text-pink-400 animate-pulse" />
                <span className="text-sm font-medium">Find Your Perfect Match</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12 relative z-10">
        <div
          className={`transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          {step === 1 && (
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-pink-500/20 to-purple-500/20 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
                  <Sparkles className="w-5 h-5 text-yellow-400 animate-spin" />
                  <span className="text-white/90 font-medium">Step 1 of 3</span>
                </div>
                <h2 className="text-5xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-orange-400 bg-clip-text text-transparent mb-6">
                  What's Your Dream Partner Like?
                </h2>
                <p className="text-white/70 text-xl max-w-2xl mx-auto leading-relaxed">
                  Let's discover your perfect match through the power of AI. Every great love story starts with knowing
                  what you're looking for.
                </p>

                {/* Animated progress bar */}
                <div className="flex items-center justify-center space-x-3 mt-8">
                  <div className="w-8 h-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"></div>
                  <div className="w-8 h-2 bg-white/20 rounded-full"></div>
                  <div className="w-8 h-2 bg-white/20 rounded-full"></div>
                </div>
              </div>

              <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-orange-500/10 border-b border-white/10 p-8">
                  <CardTitle className="text-white flex items-center space-x-3 text-2xl">
                    <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <span>Basic Preferences</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-10 p-8">
                  <div className="space-y-6">
                    <Label className="text-white font-semibold text-xl block">What gender are you looking for?</Label>
                    <Select value={traits.gender} onValueChange={(value) => setTraits({ ...traits, gender: value })}>
                      <SelectTrigger className="bg-white/10 backdrop-blur-sm border-white/20 text-white focus:border-pink-400 h-14 rounded-2xl text-lg">
                        <SelectValue placeholder="Select preferred gender" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800/95 backdrop-blur-xl border-white/20 rounded-2xl">
                        <SelectItem value="male" className="text-white hover:bg-white/10 rounded-xl m-1">
                          Male
                        </SelectItem>
                        <SelectItem value="female" className="text-white hover:bg-white/10 rounded-xl m-1">
                          Female
                        </SelectItem>
                        <SelectItem value="non-binary" className="text-white hover:bg-white/10 rounded-xl m-1">
                          Non-binary
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-6">
                    <Label className="text-white font-semibold text-xl block">
                      What personality type attracts you most?
                    </Label>
                    <RadioGroup
                      value={traits.personality}
                      onValueChange={(value) => setTraits({ ...traits, personality: value })}
                      className="space-y-4"
                    >
                      <div className="group">
                        <div className="flex items-center space-x-4 p-6 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-pink-400/50 cursor-pointer">
                          <RadioGroupItem value="extrovert" id="extrovert" className="border-pink-400 text-pink-400" />
                          <Label htmlFor="extrovert" className="text-white cursor-pointer flex-1">
                            <div className="flex items-center space-x-3">
                              <Sun className="w-6 h-6 text-yellow-400" />
                              <div>
                                <div className="font-semibold text-lg">Extrovert</div>
                                <div className="text-white/70">Outgoing, social, loves being around people</div>
                              </div>
                            </div>
                          </Label>
                        </div>
                      </div>
                      <div className="group">
                        <div className="flex items-center space-x-4 p-6 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-purple-400/50 cursor-pointer">
                          <RadioGroupItem
                            value="introvert"
                            id="introvert"
                            className="border-purple-400 text-purple-400"
                          />
                          <Label htmlFor="introvert" className="text-white cursor-pointer flex-1">
                            <div className="flex items-center space-x-3">
                              <Moon className="w-6 h-6 text-blue-400" />
                              <div>
                                <div className="font-semibold text-lg">Introvert</div>
                                <div className="text-white/70">Thoughtful, introspective, enjoys quiet moments</div>
                              </div>
                            </div>
                          </Label>
                        </div>
                      </div>
                      <div className="group">
                        <div className="flex items-center space-x-4 p-6 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-orange-400/50 cursor-pointer">
                          <RadioGroupItem
                            value="ambivert"
                            id="ambivert"
                            className="border-orange-400 text-orange-400"
                          />
                          <Label htmlFor="ambivert" className="text-white cursor-pointer flex-1">
                            <div className="flex items-center space-x-3">
                              <Zap className="w-6 h-6 text-orange-400" />
                              <div>
                                <div className="font-semibold text-lg">Ambivert</div>
                                <div className="text-white/70">Balanced, adaptable to different social situations</div>
                              </div>
                            </div>
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <Button
                    onClick={nextStep}
                    className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 hover:from-pink-600 hover:via-purple-600 hover:to-orange-600 text-white font-bold py-6 text-xl shadow-2xl rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-pink-500/25"
                    disabled={!traits.personality || !traits.gender}
                  >
                    Continue Your Journey
                    <ArrowRight className="w-6 h-6 ml-3" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {step === 2 && (
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500/20 to-orange-500/20 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
                  <Heart className="w-5 h-5 text-pink-400 animate-pulse" />
                  <span className="text-white/90 font-medium">Step 2 of 3</span>
                </div>
                <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent mb-6">
                  Shared Passions & Interests
                </h2>
                <p className="text-white/70 text-xl max-w-2xl mx-auto leading-relaxed">
                  What should light up their eyes? Choose the interests that would create magical moments together.
                </p>

                <div className="flex items-center justify-center space-x-3 mt-8">
                  <div className="w-8 h-2 bg-white/30 rounded-full"></div>
                  <div className="w-8 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                  <div className="w-8 h-2 bg-white/20 rounded-full"></div>
                </div>
              </div>

              <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 border-b border-white/10 p-8">
                  <CardTitle className="text-white flex items-center space-x-3 text-2xl">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <span>Select Interests (Choose multiple)</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8 p-8">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      { name: "Travel", icon: "✈️", color: "from-blue-500 to-cyan-500" },
                      { name: "Music", icon: "🎵", color: "from-purple-500 to-pink-500" },
                      { name: "Fitness", icon: "💪", color: "from-green-500 to-emerald-500" },
                      { name: "Cooking", icon: "👨‍🍳", color: "from-orange-500 to-red-500" },
                      { name: "Reading", icon: "📚", color: "from-indigo-500 to-purple-500" },
                      { name: "Art", icon: "🎨", color: "from-pink-500 to-rose-500" },
                      { name: "Photography", icon: "📸", color: "from-gray-500 to-slate-500" },
                      { name: "Gaming", icon: "🎮", color: "from-violet-500 to-purple-500" },
                      { name: "Dancing", icon: "💃", color: "from-pink-500 to-red-500" },
                      { name: "Movies", icon: "🎬", color: "from-yellow-500 to-orange-500" },
                      { name: "Sports", icon: "⚽", color: "from-green-500 to-blue-500" },
                      { name: "Nature", icon: "🌿", color: "from-green-500 to-teal-500" },
                    ].map((interest) => (
                      <div
                        key={interest.name}
                        className={`group relative overflow-hidden rounded-2xl transition-all duration-300 hover:scale-105 ${traits.interests.includes(interest.name)
                          ? "ring-2 ring-pink-400 shadow-lg shadow-pink-400/25"
                          : "hover:shadow-lg"
                          }`}
                      >
                        <div
                          className={`absolute inset-0 bg-gradient-to-r ${interest.color} opacity-20 group-hover:opacity-30 transition-opacity duration-300`}
                        ></div>
                        <div className="relative flex items-center space-x-4 p-6 bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
                          <Checkbox
                            id={interest.name}
                            checked={traits.interests.includes(interest.name)}
                            onCheckedChange={(checked) => handleInterestChange(interest.name, checked)}
                            className="border-white/30 data-[state=checked]:bg-pink-500 data-[state=checked]:border-pink-500"
                          />
                          <div className="flex items-center space-x-3 flex-1">
                            <span className="text-2xl">{interest.icon}</span>
                            <Label htmlFor={interest.name} className="text-white cursor-pointer font-medium text-lg">
                              {interest.name}
                            </Label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex space-x-4 pt-6">
                    <Button
                      onClick={prevStep}
                      variant="outline"
                      className="flex-1 border-white/20 text-white hover:bg-white/10 py-6 text-lg rounded-2xl backdrop-blur-sm bg-transparent"
                    >
                      <ArrowLeft className="w-5 h-5 mr-3" />
                      Back
                    </Button>
                    <Button
                      onClick={nextStep}
                      className="flex-1 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 text-white font-bold py-6 text-lg shadow-2xl rounded-2xl transition-all duration-300 hover:scale-105"
                      disabled={traits.interests.length === 0}
                    >
                      Continue
                      <ArrowRight className="w-5 h-5 ml-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {step === 3 && (
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500/20 to-pink-500/20 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
                  <Star className="w-5 h-5 text-yellow-400 animate-pulse" />
                  <span className="text-white/90 font-medium">Step 3 of 3</span>
                </div>
                <h2 className="text-5xl font-bold bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-6">
                  Values & Life Vision
                </h2>
                <p className="text-white/70 text-xl max-w-2xl mx-auto leading-relaxed">
                  The final touches to create your perfect match. What values and qualities matter most to your heart?
                </p>

                <div className="flex items-center justify-center space-x-3 mt-8">
                  <div className="w-8 h-2 bg-white/30 rounded-full"></div>
                  <div className="w-8 h-2 bg-white/30 rounded-full"></div>
                  <div className="w-8 h-2 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full"></div>
                </div>
              </div>

              <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-orange-500/10 via-pink-500/10 to-purple-500/10 border-b border-white/10 p-8">
                  <CardTitle className="text-white flex items-center space-x-3 text-2xl">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <span>Final Preferences</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-10 p-8">
                  <div className="space-y-6">
                    <Label className="text-white font-semibold text-xl block">
                      What values are most important to you?
                    </Label>
                    <RadioGroup
                      value={traits.values}
                      onValueChange={(value) => setTraits({ ...traits, values: value })}
                      className="space-y-4"
                    >
                      {[
                        {
                          value: "family",
                          title: "Family & Relationships",
                          desc: "Values close relationships and family bonds",
                          icon: "👨‍👩‍👧‍👦",
                        },
                        {
                          value: "career",
                          title: "Career & Success",
                          desc: "Ambitious and driven to achieve goals",
                          icon: "🚀",
                        },
                        {
                          value: "adventure",
                          title: "Adventure & Freedom",
                          desc: "Loves exploring and trying new experiences",
                          icon: "🌍",
                        },
                      ].map((option) => (
                        <div key={option.value} className="group">
                          <div className="flex items-center space-x-4 p-6 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-orange-400/50 cursor-pointer">
                            <RadioGroupItem
                              value={option.value}
                              id={option.value}
                              className="border-orange-400 text-orange-400"
                            />
                            <Label htmlFor={option.value} className="text-white cursor-pointer flex-1">
                              <div className="flex items-center space-x-4">
                                <span className="text-3xl">{option.icon}</span>
                                <div>
                                  <div className="font-semibold text-lg">{option.title}</div>
                                  <div className="text-white/70">{option.desc}</div>
                                </div>
                              </div>
                            </Label>
                          </div>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <div className="space-y-6">
                    <Label className="text-white font-semibold text-lg block">
                      Age Range: {preferences.ageRange[0]} - {preferences.ageRange[1]} years
                    </Label>
                    <div className="px-4">
                      <Slider
                        value={preferences.ageRange}
                        onValueChange={(value) => setPreferences({ ...preferences, ageRange: value })}
                        max={60}
                        min={18}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <Label className="text-white font-semibold text-xl block">
                      What unique quality would make them special?
                    </Label>
                    <RadioGroup
                      value={traits.quirks}
                      onValueChange={(value) => setTraits({ ...traits, quirks: value })}
                      className="space-y-4"
                    >
                      {[
                        { value: "great sense of humor", icon: "😄", color: "from-yellow-500 to-orange-500" },
                        { value: "incredibly creative", icon: "🎨", color: "from-purple-500 to-pink-500" },
                        { value: "deeply empathetic", icon: "💝", color: "from-pink-500 to-red-500" },
                        { value: "intellectually curious", icon: "🧠", color: "from-blue-500 to-purple-500" },
                      ].map((option) => (
                        <div key={option.value} className="group">
                          <div className="relative overflow-hidden rounded-2xl">
                            <div
                              className={`absolute inset-0 bg-gradient-to-r ${option.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}
                            ></div>
                            <div className="relative flex items-center space-x-4 p-6 bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-pink-400/50 cursor-pointer">
                              <RadioGroupItem
                                value={option.value}
                                id={option.value}
                                className="border-pink-400 text-pink-400"
                              />
                              <Label
                                htmlFor={option.value}
                                className="text-white cursor-pointer flex items-center space-x-3"
                              >
                                <span className="text-2xl">{option.icon}</span>
                                <span className="font-medium text-lg capitalize">{option.value}</span>
                              </Label>
                            </div>
                          </div>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <div className="flex space-x-4 pt-6">
                    <Button
                      onClick={prevStep}
                      variant="outline"
                      className="flex-1 border-white/20 text-white hover:bg-white/10 py-6 text-lg rounded-2xl backdrop-blur-sm bg-transparent"
                    >
                      <ArrowLeft className="w-5 h-5 mr-3" />
                      Back
                    </Button>
                    <Button
                      onClick={handleGenerate}
                      className="flex-1 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 hover:from-orange-600 hover:via-pink-600 hover:to-purple-600 text-white font-bold py-6 text-lg shadow-2xl rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-pink-500/25"
                      disabled={isGenerating || !traits.values || !traits.quirks}
                    >
                      {isGenerating ? (
                        <>
                          <Brain className="w-5 h-5 mr-3 animate-spin" />
                          Creating Magic...
                        </>
                      ) : (
                        <>
                          Generate My Soulmate
                          <Sparkles className="w-5 h-5 ml-3" />
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {step === 4 && generatedMatch && (
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-pink-500/20 to-purple-500/20 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
                  <Heart className="w-5 h-5 text-pink-400 animate-pulse" />
                  <span className="text-white/90 font-medium">Your Perfect Match</span>
                </div>
                <h2 className="text-5xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-orange-400 bg-clip-text text-transparent mb-6">
                  Meet Your Soulmate
                </h2>
                <p className="text-white/70 text-xl max-w-2xl mx-auto leading-relaxed">
                  Crafted by AI, designed by destiny. Here's someone who could be perfect for you.
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl overflow-hidden group hover:shadow-pink-500/20 transition-all duration-500">
                  <CardContent className="p-0">
                    <div className="aspect-square">
                      <SoulmateImage />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-orange-500/10 border-b border-white/10 p-8">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white text-3xl font-bold">{generatedMatch.name}</CardTitle>
                      <div className="flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-purple-500 px-4 py-2 rounded-full shadow-lg">
                        <Star className="w-5 h-5 text-white animate-pulse" />
                        <span className="text-white font-bold text-lg">{generatedMatch.compatibility}% Match</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-8 p-8">
                    <p className="text-white/90 text-xl leading-relaxed font-medium">{generatedMatch.description}</p>

                    <div>
                      <h3 className="text-white font-bold mb-4 text-xl flex items-center space-x-2">
                        <Sparkles className="w-6 h-6 text-yellow-400" />
                        <span>Key Traits</span>
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {generatedMatch.traits.map((trait, index) => (
                          <Badge
                            key={index}
                            className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-200 border border-pink-400/30 px-4 py-2 text-sm font-medium rounded-full backdrop-blur-sm hover:scale-105 transition-transform duration-200"
                          >
                            {trait}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-white/10 space-y-4">
                      <div className="relative">
                        <Button
                          onClick={() => setShowShareMenu(!showShareMenu)}
                          className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 text-white font-bold py-4 text-lg shadow-2xl rounded-2xl transition-all duration-300 hover:scale-105"
                        >
                          <Share2 className="w-5 h-5 mr-3" />
                          Share Your Perfect Match
                        </Button>

                        <div className="relative">

                          {showShareMenu && (
                            <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-slate-800/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
                              <div className="flex overflow-x-auto p-2 space-x-2 no-scrollbar">
                                <Button
                                  onClick={() => {
                                    shareToTwitter();
                                    setShowShareMenu(false);
                                  }}
                                  className="min-w-[40px] h-10 p-0 bg-transparent hover:bg-blue-500/20 text-white rounded-full flex items-center justify-center"
                                  title="Twitter"
                                >
                                  <Twitter className="w-5 h-5" />
                                </Button>

                                <Button
                                  onClick={() => {
                                    shareToFacebook();
                                    setShowShareMenu(false);
                                  }}
                                  className="min-w-[40px] h-10 p-0 bg-transparent hover:bg-blue-600/20 text-white rounded-full flex items-center justify-center"
                                  title="Facebook"
                                >
                                  <Facebook className="w-5 h-5" />
                                </Button>

                                <Button
                                  onClick={() => {
                                    shareToInstagram();
                                    setShowShareMenu(false);
                                  }}
                                  className="min-w-[40px] h-10 p-0 bg-transparent hover:bg-pink-500/20 text-white rounded-full flex items-center justify-center"
                                  title="Instagram"
                                >
                                  <Instagram className="w-5 h-5" />
                                </Button>

                                <Button
                                  onClick={() => {
                                    copyToClipboard();
                                    setShowShareMenu(false);
                                  }}
                                  className="min-w-[40px] h-10 p-0 bg-transparent hover:bg-gray-500/20 text-white rounded-full flex items-center justify-center"
                                  title="Copy Link"
                                >
                                  <Copy className="w-5 h-5" />
                                </Button>

                                <Button
                                  onClick={() => {
                                    shareToWhatsApp();
                                    setShowShareMenu(false);
                                  }}
                                  className="min-w-[40px] h-10 p-0 bg-transparent hover:bg-green-500/20 text-white rounded-full flex items-center justify-center"
                                  title="WhatsApp"
                                >
                                  <MessageCircle className="w-5 h-5" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <Button
                          onClick={regenerateNameAndDescription}
                          variant="outline"
                          className="border-white/20 text-white hover:bg-white/10 py-4 bg-transparent rounded-2xl backdrop-blur-sm transition-all duration-300 hover:scale-105"
                          disabled={imageLoading}
                        >
                          <Sparkles className={`w-4 h-4 mr-2 ${imageLoading ? "animate-spin" : ""}`} />
                          New Bio
                        </Button>
                        <Button
                          onClick={regenerateImage}
                          variant="outline"
                          className="border-white/20 text-white hover:bg-white/10 py-4 bg-transparent rounded-2xl backdrop-blur-sm transition-all duration-300 hover:scale-105"
                          disabled={imageLoading}
                        >
                          <RefreshCw className={`w-4 h-4 mr-2 ${imageLoading ? "animate-spin" : ""}`} />
                          New Photo
                        </Button>
                      </div>

                      <Button
                        onClick={() => {
                          setStep(1)
                          setGeneratedMatch(null)
                          setImageUrl("")
                          setTraits({
                            personality: "",
                            lifestyle: "",
                            interests: [],
                            values: "",
                            quirks: "",
                            gender: "",
                          })
                          setIsVisible(false)
                          setTimeout(() => setIsVisible(true), 300)
                        }}
                        className="w-full bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 hover:from-orange-600 hover:via-pink-600 hover:to-purple-600 text-white font-bold py-4 text-lg shadow-2xl rounded-2xl transition-all duration-300 hover:scale-105"
                      >
                        Find Another Soulmate
                        <Heart className="w-5 h-5 ml-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>

        {isGenerating && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
            <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl max-w-md w-full mx-4 rounded-3xl overflow-hidden">
              <CardContent className="p-12">
                <div className="text-center">
                  <div className="relative mb-8">
                    <div className="w-24 h-24 bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 rounded-full mx-auto flex items-center justify-center animate-pulse">
                      <Brain className="w-12 h-12 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <h3 className="text-white text-3xl font-bold mb-4">Creating Your Soulmate...</h3>
                  <p className="text-white/80 mb-6 text-lg">
                    Our AI is weaving together the perfect match just for you
                  </p>
                  <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 h-3 rounded-full animate-pulse transition-all duration-1000"
                      style={{ width: "75%" }}
                    ></div>
                  </div>
                  <p className="text-white/60 text-sm mt-4">This may take a few moments...</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
