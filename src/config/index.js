let config = {}
const sanitizeConfig = {
  allowedTags: ['b', 'i', 'em', 'strong', 'a', 'sup', 'sub', 'table', 'thead', 'caption', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol', 'span',
    'nl', 'li', 'strong', 'strike', 'code', 'hr', 'br', 'div',
    'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'iframe', 'img'],
  allowedAttributes: {
    'a': ['href', 'name', 'target'],
    '*': ['style', 'align', 'alt', 'center', 'bgcolor', 'border', 'scope', 'cellspacing', 'cellpadding', 'colspan', 'width', 'height', 'src'],
    'iframe': ['src', 'allowfullscreen'],
    'img': ['src', 'alt']
  },
  allowedStyles: {
    '*': {
      // Match HEX and RGB
      'color': [/^(0x)?[0-9a-f]+$/i, /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/],
      'background-color': [/^(0x)?[0-9a-f]+$/i, /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/],
      'text-align': [/^left$/, /^right$/, /^center$/],
      // Match any number with px, em, or %
      'font-size': [/^\d+$[px|em|]$/],
      'text-decoration': [/^line-through$/, /^underline$/],
      'width': [/^.*/],
      'height': [/^.*/],
      'border-collapse': [/^.*/],
      'border-style': [/^.*/],
      'vertical-align': [/^.*/],
      'margin-right': [/^.*/],
      'margin-left': [/^.*/]
    }
  },
  selfClosing: ['img', 'br', 'hr', 'area', 'base', 'basefont', 'input', 'link', 'meta'],
  allowedSchemes: ['http', 'https', 'ftp', 'mailto', 'data'],
  allowedSchemesByTag: {},
  allowProtocolRelative: true,
  allowedIframeHostnames: ['www.youtube.com', 'player.vimeo.com']
}
module.exports = {
  setEnvironment: function (environment) {
    config = require('./' + environment + '.json')
  },
  getConfig: function () {
    return config
  },
  sanitizeHtmlConfig: sanitizeConfig
}
