// ./components/ChatWidget.tsx
"use client"
import Script from "next/script"
import { useEffect, useCallback } from "react"

const ChatWidget = () => {
  const applyKozkerStyling = useCallback(() => {
    const widget = document.querySelector(".n8n-chat-widget") as HTMLElement
    if (!widget) return false

    try {
      // Apply Kozker brand colors
      widget.style.setProperty("--n8n-chat-primary-color", "#ff6e30")
      widget.style.setProperty("--n8n-chat-secondary-color", "#d45a24")
      widget.style.setProperty("--n8n-chat-background-color", "#ffffff")
      widget.style.setProperty("--n8n-chat-font-color", "#333333")

      // Apply Kozker branding content
      const brandNames = widget.querySelectorAll(".brand-header span")
      brandNames.forEach(brandName => {
        if (!brandName.textContent?.trim()) {
          brandName.textContent = "Kozker Tech Support"
        }
      })

      const logos = widget.querySelectorAll(".brand-header img") as NodeListOf<HTMLImageElement>
      logos.forEach(logo => {
        if (!logo.src || logo.src.includes("data:") || logo.src === window.location.href) {
          logo.src = "/apple-touch-icon.png"
          logo.alt = "Kozker Tech Support"
        }
      })

      const welcomeTexts = widget.querySelectorAll(".welcome-text")
      welcomeTexts.forEach(welcomeText => {
        if (!welcomeText.textContent?.trim()) {
          welcomeText.textContent = "Hi 👋, how can we help?"
        }
      })

      const responseTexts = widget.querySelectorAll(".response-text")
      responseTexts.forEach(responseText => {
        if (!responseText.textContent?.trim()) {
          responseText.textContent = "We typically respond right away"
        }
      })

      console.log("✅ Kozker styling and branding applied successfully")
      return true
    } catch (error) {
      console.error("❌ Error applying Kozker styling:", error)
      return false
    }
  }, [])

  const initializeWidget = useCallback(() => {
    // Set global configuration with error handling
    try {
      (window as any).ChatWidgetConfig = {
        webhook: {
          url: 'https://n8n.srv832341.hstgr.cloud/webhook/f406671e-c954-4691-b39a-66c90aa2f103/chat',
          route: 'general'
        },
        branding: {
          logo: '/apple-touch-icon.png',
          name: 'Kozker Tech Support',
          welcomeText: 'Hi 👋, how can we help?',
          responseTimeText: 'We typically respond right away',
          poweredBy: {
            text: 'Powered by Kozker',
            link: 'https://kozker.com'
          }
        },
        style: {
          primaryColor: '#ff6e30',
          secondaryColor: '#d45a24',
          position: 'right',
          backgroundColor: '#ffffff',
          fontColor: '#333333'
        }
      }
      console.log("✅ ChatWidget configuration initialized")
    } catch (error) {
      console.error("❌ Error setting ChatWidget configuration:", error)
    }
  }, [])

  useEffect(() => {
    // Initialize configuration immediately
    initializeWidget()

    // Function to check and apply styling repeatedly
    const tryApplyStyling = () => {
      const success = applyKozkerStyling()
      if (!success) {
        // If widget not found or styling failed, try again later
        setTimeout(tryApplyStyling, 1000)
      }
    }

    // Initial delay before trying to apply styles
    setTimeout(tryApplyStyling, 500)

    // Set up observer for dynamic widget creation
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element
              if (element.classList?.contains('n8n-chat-widget') || 
                  element.querySelector?.('.n8n-chat-widget')) {
                console.log("📊 Chat widget detected in DOM")
                setTimeout(applyKozkerStyling, 100)
              }
            }
          })
        }
      })
    })

    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    })

    // Cleanup
    return () => observer.disconnect()
  }, [applyKozkerStyling, initializeWidget])

  return (
    <>
      {/* Configuration Script - Load first */}
      <Script 
        id="kozker-chat-config"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            // Ensure config is available before widget script loads
            window.ChatWidgetConfig = {
              webhook: {
                url: 'https://n8n.srv832341.hstgr.cloud/webhook/f406671e-c954-4691-b39a-66c90aa2f103/chat',
                route: 'general'
              },
              branding: {
                logo: '/apple-touch-icon.png',
                name: 'Kozker Tech Support',
                welcomeText: 'Hi 👋, how can we help?',
                responseTimeText: 'We typically respond right away',
                poweredBy: {
                  text: 'Powered by Kozker',
                  link: 'https://kozker.com'
                }
              },
              style: {
                primaryColor: '#ff6e30',
                secondaryColor: '#d45a24', 
                position: 'right',
                backgroundColor: '#ffffff',
                fontColor: '#333333'
              }
            };
            console.log('🔧 Kozker chat configuration loaded:', window.ChatWidgetConfig);
          `,
        }}
      />

      {/* Chat Widget Script */}
      <Script
        src="https://cdn.jsdelivr.net/gh/WayneSimpson/n8n-chatbot-template@ba944c3/chat-widget.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log("🚀 Chat widget script loaded successfully")
          
          // Apply styling after script loads
          setTimeout(() => {
            const applied = applyKozkerStyling()
            if (applied) {
              console.log("🎨 Initial styling applied on script load")
            }
          }, 300)

          // Verify widget configuration after load
          setTimeout(() => {
            const widget = document.querySelector(".n8n-chat-widget") as HTMLElement
            if (widget) {
              const computedStyle = getComputedStyle(widget)
              console.log("🔍 Widget verification:", {
                found: "✅",
                primaryColor: computedStyle.getPropertyValue("--n8n-chat-primary-color") || "❌ Not set",
                secondaryColor: computedStyle.getPropertyValue("--n8n-chat-secondary-color") || "❌ Not set",
                branding: widget.querySelector(".brand-header span")?.textContent || "❌ Not set"
              })
            } else {
              console.log("⚠️ Widget not found after script load")
            }
          }, 1000)
        }}
        onError={(error) => {
          console.error("❌ Failed to load chat widget script:", error)
        }}
      />
    </>
  )
}

export default ChatWidget
