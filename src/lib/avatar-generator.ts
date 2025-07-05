// Avatar generation utilities for interview articles

export interface PersonInfo {
  name: string
  company: string
  industry: string
  gender?: 'male' | 'female' | 'neutral'
  age?: 'young' | 'middle' | 'senior'
}

// Generate avatar URL using DiceBear API (free, no signup required)
export function generateAvatar(person: PersonInfo): string {
  const style = 'avataaars' // Professional style
  const seed = encodeURIComponent(person.name + person.company)
  
  // Generate consistent avatar based on person info
  const params = new URLSearchParams({
    seed,
    backgroundColor: '065f46', // Professional dark green
    clothesColor: '1f2937', // Dark gray for professional look
    skinColor: 'fdbcb4', // Default skin tone
  })
  
  return `https://api.dicebear.com/7.x/${style}/svg?${params.toString()}`
}

// Generate professional headshot URL using RoboHash API
export function generateProfessionalHeadshot(person: PersonInfo): string {
  const seed = encodeURIComponent(person.name + person.company)
  return `https://robohash.org/${seed}?set=set4&size=200x200`
}

// Generate avatar using UI Avatars (text-based)
export function generateTextAvatar(person: PersonInfo): string {
  const initials = person.name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
  
  const params = new URLSearchParams({
    name: initials,
    background: '3b82f6', // Primary blue
    color: 'ffffff',
    size: '200',
    bold: 'true',
    format: 'svg'
  })
  
  return `https://ui-avatars.com/api/?${params.toString()}`
}

// Fallback to Unsplash with professional business photos
export function generateUnsplashAvatar(person: PersonInfo): string {
  const { gender = 'neutral', age = 'middle' } = person
  
  const queries = {
    'male-young': 'young-businessman-professional-headshot',
    'male-middle': 'businessman-professional-portrait',
    'male-senior': 'senior-executive-professional',
    'female-young': 'young-businesswoman-professional',
    'female-middle': 'businesswoman-professional-portrait',
    'female-senior': 'senior-female-executive',
    'neutral-young': 'young-professional-headshot',
    'neutral-middle': 'professional-business-portrait',
    'neutral-senior': 'senior-professional-executive'
  }
  
  const query = queries[`${gender}-${age}` as keyof typeof queries] || 'professional-business-portrait'
  return `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face&q=${encodeURIComponent(query)}`
}

// Main function to get avatar with fallback chain
export function getPersonAvatar(person: PersonInfo, preferredMethod: 'dicebear' | 'text' | 'unsplash' = 'dicebear'): string {
  switch (preferredMethod) {
    case 'dicebear':
      return generateAvatar(person)
    case 'text':
      return generateTextAvatar(person)
    case 'unsplash':
    default:
      return generateUnsplashAvatar(person)
  }
}