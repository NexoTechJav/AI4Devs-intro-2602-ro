/*
  "Back-end" logic for the Reverse String page.
  - Pure functions (reverse)
  - Clipboard helper (copy)

  The front-end (DOM/event wiring) lives in index.html.
*/

(function(){
  'use strict';

  /** Safely reverse a string, preserving surrogate pairs (emoji, etc.). */
  function reverseText(input){
    if (input === null || input === undefined) return '';
    const str = String(input);

    // Use Array.from to split by Unicode code points (handles surrogate pairs)
    return Array.from(str).reverse().join('');
  }

  /** Copy text to clipboard with modern API + fallback. Returns a Promise<boolean>. */
  async function copyToClipboard(text){
    const value = (text === null || text === undefined) ? '' : String(text);

    // Prefer Clipboard API
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function'){
      try{
        await navigator.clipboard.writeText(value);
        return true;
      }catch(_){
        // fall through to fallback
      }
    }

    // Fallback: temporary textarea + execCommand
    try{
      const ta = document.createElement('textarea');
      ta.value = value;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      ta.style.top = '0';
      document.body.appendChild(ta);
      ta.select();
      ta.setSelectionRange(0, ta.value.length);
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return !!ok;
    }catch(_){
      return false;
    }
  }

  // Expose in a single namespace for the front-end.
  window.ReverseStringBackend = {
    reverseText,
    copyToClipboard
  };
})();
