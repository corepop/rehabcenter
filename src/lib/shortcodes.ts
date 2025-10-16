// WordPress Shortcode Handler for Astro
// Handles common WordPress shortcodes that don't render in headless CMS

export function processWordPressShortcodes(content: string): string {
  if (!content) return content;

  return content
    // Handle HTML entities that might appear as raw text
    .replace(/</gi, '<')
    .replace(/>/gi, '>')
    .replace(/&/gi, '&')
    .replace(/"/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&nbsp;/gi, ' ')

    // Handle HTML paragraph tags that might appear as raw text
    .replace(/<p>/gi, '<p>')
    .replace(/<\/p>/gi, '</p>')
    .replace(/<br\s*\/?>/gi, '<br>')

    // Caption shortcode
    .replace(/\[caption[^\]]*\](.*?)\[\/caption\]/gis, '<figure>$1</figure>')

    // Gallery shortcode (basic)
    .replace(/\[gallery[^\]]*\]/gi, '<div class="wp-gallery">Gallery placeholder</div>')

    // YouTube embed
    .replace(/\[youtube[^\]]*\](.*?)\[\/youtube\]/gi, (match, url) => {
      const videoId = extractYouTubeId(url);
      return videoId ? `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen class="rounded-md shadow-lg"></iframe>` : match;
    })

    // Vimeo embed
    .replace(/\[vimeo[^\]]*\](.*?)\[\/vimeo\]/gi, (match, url) => {
      const videoId = extractVimeoId(url);
      return videoId ? `<iframe width="560" height="315" src="https://player.vimeo.com/video/${videoId}" frameborder="0" allowfullscreen class="rounded-md shadow-lg"></iframe>` : match;
    })

    // Contact Form 7 and other form shortcodes
    .replace(/\[contact-form-7[^\]]*\]/gi, '<div class="wp-form-placeholder">Contact form placeholder</div>')
    .replace(/\[form[^\]]*\]/gi, '<div class="wp-form-placeholder">Form placeholder</div>')

    // Button shortcode
    .replace(/\[button[^\]]*\](.*?)\[\/button\]/gi, '<button class="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark">$1</button>')

    // Generic shortcode cleanup - remove unknown shortcodes
    .replace(/\[\/?[^\]]+\]/g, '');
}

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
}

function extractVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return match ? match[1] : null;
}

// Alternative: Strip all shortcodes (if you don't want to process them)
export function stripWordPressShortcodes(content: string): string {
  if (!content) return content;
  return content.replace(/\[\/?[^\]]+\]/g, '');
}

// Process content for different contexts
export function processContentForDisplay(content: string, context: 'full' | 'excerpt' = 'full'): string {
  let processed = processWordPressShortcodes(content);

  // For excerpts, we might want to be more aggressive with shortcode removal
  if (context === 'excerpt') {
    processed = stripWordPressShortcodes(processed);
    // Remove HTML tags for cleaner excerpts
    processed = processed.replace(/<[^>]*>/g, '');
    // Limit length for excerpts
    if (processed.length > 200) {
      processed = processed.substring(0, 200) + '...';
    }
  }

  return processed;
}

// Specific function for processing excerpts/subheadings that might contain raw HTML
export function processExcerptForDisplay(excerpt: string): string {
  if (!excerpt) return excerpt;

  // First, clean the excerpt of HTML and shortcodes
  const cleanExcerpt = excerpt
    // Handle HTML entities that might appear as raw text
    .replace(/</gi, '<')
    .replace(/>/gi, '>')
    .replace(/&/gi, '&')
    .replace(/"/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&nbsp;/gi, ' ')

    // Remove HTML tags for clean text display
    .replace(/<[^>]*>/g, '')

    // Remove any remaining shortcodes
    .replace(/\[\/?[^\]]+\]/g, '')

    // Clean up extra whitespace
    .replace(/\s+/g, ' ')
    .trim();

  // Limit to 2 sentences while preserving original punctuation
  const sentences = cleanExcerpt.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);

  if (sentences.length <= 2) {
    return cleanExcerpt;
  }

  // Find the punctuation marks in the original text
  const punctuationMatches = [...cleanExcerpt.matchAll(/[.!?]+/g)];
  if (punctuationMatches.length >= 2) {
    // Get the position of the second punctuation mark
    const secondPunctuationMatch = punctuationMatches[1];
    const secondPunctuationIndex = secondPunctuationMatch.index! + secondPunctuationMatch[0].length - 1;
    return cleanExcerpt.substring(0, secondPunctuationIndex + 1).trim();
  }

  // Fallback: if we can't find punctuation, limit by character count
  return cleanExcerpt.length > 150 ? cleanExcerpt.substring(0, 150) + '...' : cleanExcerpt;
}
