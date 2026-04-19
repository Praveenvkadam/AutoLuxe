# PROMPTS.md

These are actual prompts used while building this project, along with honest reflections on what worked, what didn't, and how I improved them.

---

### 1. Intent Extraction
**Prompt:**  
"Convert this user query into a structured JSON intent with action, filters, and target section."

**Worked first time?**  
No  
**Fix:** Had to explicitly define schema and give examples.  
**Reflection:** I learned that AI needs clear structure. I added a JSON schema example and specific field definitions, which made the output much more consistent.

---

### 2. UI Action Mapping
**Prompt:**  
"Given this intent JSON, return UI actions like scrollTarget, filterCriteria, and updates."

**Worked first time?**  
Yes  
**Fix:** None  
**Reflection:** This worked well because I had already established a clear schema in the previous prompt. Consistency in data structure is key.

---

### 3. Car Filtering Logic
**Prompt:**  
"Write a function to filter cars based on price, type, and features."

**Worked first time?**  
Mostly  
**Fix:** Needed edge-case handling (null filters)  
**Reflection:** I realized I needed to think about real-world scenarios. I added null checks and default behaviors to make the function more robust.

---

### 4. Smooth Scroll Implementation
**Prompt:**  
"Implement smooth scrolling to a section in React when given an ID."

**Worked first time?**  
Yes  
**Fix:** None  
**Reflection:** This was straightforward once I remembered React's useRef hook. Sometimes the simplest solutions work best.

---

### 5. Dynamic Form Prefill
**Prompt:**  
"Auto-fill a form in React based on external state updates."

**Worked first time?**  
No  
**Fix:** Needed controlled components instead of uncontrolled inputs  
**Reflection:** I learned the importance of controlled components in React. Uncontrolled inputs don't update properly with state changes.

---

### 6. Currency Conversion UI
**Prompt:**  
"Switch pricing display dynamically between INR and USD."

**Worked first time?**  
Yes  
**Fix:** Added global currency state later  
**Reflection:** Starting simple worked well. I could add complexity (global state) later as needed.

---

### 7. Comparison Table Logic
**Prompt:**  
"Generate a comparison table for two selected car objects."

**Worked first time?**  
Partially  
**Fix:** Needed normalization of specs structure  
**Reflection:** I learned that data normalization is crucial for comparison operations. I had to standardize the car specs format first.

---

### 8. Recommendation Logic
**Prompt:**  
"Suggest best car based on family size and usage."

**Worked first time?**  
No  
**Fix:** Too generic — rewrote with explicit rules  
**Reflection:** Vague prompts lead to vague results. I learned to be specific about the recommendation criteria and rules.

---

### 9. Chat UI Component
**Prompt:**  
"Build a floating AI chat widget with message history."

**Worked first time?**  
Yes  
**Fix:** Styling adjustments only  
**Reflection:** Clear visual requirements help. I specified the exact UI behavior and it worked well.

---

### 10. State Synchronization
**Prompt:**  
"Keep UI state in sync with AI-triggered updates across components."

**Worked first time?**  
No  
**Fix:** Switched to centralized state management  
**Reflection:** I learned that complex state synchronization needs proper architecture. Local state wasn't enough for cross-component updates.

---

## Key Realization

**Vague prompts waste time. The more structured your prompt, the fewer iterations you need.**

I learned that successful AI prompting is like writing good code:
- Be specific about inputs and outputs
- Define clear schemas and structures
- Think about edge cases upfront
- Start simple, then add complexity
- Test and iterate based on results

The most valuable lesson was that prompt engineering is a skill that improves with practice and honest reflection on what works and what doesn't.