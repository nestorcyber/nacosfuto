/**
 * geminiService.js
 * AI Curriculum Generation powered by Gemini 2.5 Flash for Upskill Hub.
 */

export const aiService = {
  /**
   * Generates a full course curriculum using Gemini REST API or rich fallback curriculum.
   */
  async generateCurriculum(
    title,
    description = "",
    level = "beginner",
    tags = [],
    referenceVideos = "",
    additionalInfo = ""
  ) {
    const apiKey =
      (typeof import.meta !== "undefined" && import.meta.env?.VITE_GEMINI_API_KEY) ||
      (typeof process !== "undefined" && process.env?.GEMINI_API_KEY) ||
      "";

    if (!apiKey) {
      console.info("Gemini API key not active, using generated curriculum template.");
      return this.getMockGeneratedCurriculum(title, level);
    }

    let extraContext = "";
    let extraRules = "";
    let ruleIndex = 1;

    if (referenceVideos && referenceVideos.trim() !== "") {
      extraContext += `\n    User Reference Videos: "${referenceVideos}"`;
      extraRules += `\n    ${ruleIndex++}. PROVIDED REFERENCE VIDEOS FIRST: You MUST extract and use these provided YouTube videos. Extract the 11-char video ID and assign it to 'video_url'.`;
    }

    if (additionalInfo && additionalInfo.trim() !== "") {
      extraContext += `\n    User Additional Info: "${additionalInfo}"`;
      extraRules += `\n    ${ruleIndex++}. ADDITIONAL INFO: Adhere to instructions inside User Additional Info.`;
    }

    const prompt = `Create a professional, high-impact curriculum for a ${level} course.
    Title: "${title}"
    Context: "${description}"
    Tags: ${tags.join(", ")}${extraContext}
    
    CRITICAL QUALITY RULES:${extraRules}
    ${ruleIndex++}. RELIABLE VIDEOS ONLY: Generate 4-8 topics with valid 11-character YouTube IDs.
    ${ruleIndex++}. LONG SUMMARIES: Each topic must have a detailed educational summary text.

    Return the results strictly as a JSON array of objects with keys: title, summary_text, video_url, duration, start_playing_at, order_index. Do not wrap in markdown tags.`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API returned status ${response.status}`);
      }

      const data = await response.json();
      const text =
        data.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
      const cleanedJson = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const topics = JSON.parse(cleanedJson);

      return topics.map((t, idx) => {
        let cleanId = t.video_url || "W6NZfCO5SIk";
        if (cleanId.includes("v=")) {
          cleanId = cleanId.split("v=")[1].split("&")[0];
        }
        if (cleanId.includes("youtu.be/")) {
          cleanId = cleanId.split("youtu.be/")[1].split("?")[0];
        }

        return {
          id: `topic-${Date.now()}-${idx}`,
          title: t.title || `Module ${idx + 1}`,
          summary_text: t.summary_text || `Comprehensive study of ${t.title || title}.`,
          video_url: cleanId.substring(0, 11),
          duration: t.duration || "15:00",
          start_playing_at: Math.max(0, Math.floor(Number(t.start_playing_at) || 0)),
          order_index: idx + 1,
          is_ai_generated: true,
        };
      });
    } catch (e) {
      console.warn("AI generation failed, falling back to generated topics:", e);
      return this.getMockGeneratedCurriculum(title, level);
    }
  },

  getMockGeneratedCurriculum(title, level) {
    return [
      {
        id: `topic-${Date.now()}-1`,
        title: `Introduction & Core Architecture of ${title}`,
        summary_text: `Comprehensive foundational overview of ${title}. In this module, learners examine core paradigms, system requirements, development toolchains, and initial workspace configuration for ${level} developers.`,
        video_url: "W6NZfCO5SIk",
        start_playing_at: 0,
        duration: "14:20",
        order_index: 1,
        is_ai_generated: true,
      },
      {
        id: `topic-${Date.now()}-2`,
        title: `Deep Dive: Data Structures & State Flow in ${title}`,
        summary_text: `Understanding data manipulation patterns, functional transformations, and memory efficiency in ${title}. Practical examples covering real-world industry benchmarks and design patterns.`,
        video_url: "W6NZfCO5SIk",
        start_playing_at: 860,
        duration: "18:45",
        order_index: 2,
        is_ai_generated: true,
      },
      {
        id: `topic-${Date.now()}-3`,
        title: `Advanced Implementation & Scalability Techniques`,
        summary_text: `Scalability, modular architecture, and edge-case management. Covers error recovery, caching layers, and asynchronous operations tailored for ${title}.`,
        video_url: "PoRJizFvM7s",
        start_playing_at: 0,
        duration: "21:30",
        order_index: 3,
        is_ai_generated: true,
      },
      {
        id: `topic-${Date.now()}-4`,
        title: `Production Deployment, CI/CD & Best Practices`,
        summary_text: `Packaging your project, writing integration tests, and configuring high-availability deployment pipelines for ${title}.`,
        video_url: "SqcY0GlETPk",
        start_playing_at: 0,
        duration: "16:15",
        order_index: 4,
        is_ai_generated: true,
      },
    ];
  },
};
