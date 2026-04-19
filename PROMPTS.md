
---

# PROMPTS.md

```md
# PROMPTS.md

These are actual prompts used while building this project.

---

### 1. Intent Extraction
**Prompt:**  
"Convert this user query into a structured JSON intent with action, filters, and target section."

**Worked first time?**  
No  
**Fix:** Had to explicitly define schema and give examples.

---

### 2. UI Action Mapping
**Prompt:**  
"Given this intent JSON, return UI actions like scrollTarget, filterCriteria, and updates."

**Worked first time?**  
Yes  
**Fix:** None

---

### 3. Car Filtering Logic
**Prompt:**  
"Write a function to filter cars based on price, type, and features."

**Worked first time?**  
Mostly  
**Fix:** Needed edge-case handling (null filters)

---

### 4. Smooth Scroll Implementation
**Prompt:**  
"Implement smooth scrolling to a section in React when given an ID."

**Worked first time?**  
Yes  
**Fix:** None

---

### 5. Dynamic Form Prefill
**Prompt:**  
"Auto-fill a form in React based on external state updates."

**Worked first time?**  
No  
**Fix:** Needed controlled components instead of uncontrolled inputs

---

### 6. Currency Conversion UI
**Prompt:**  
"Switch pricing display dynamically between INR and USD."

**Worked first time?**  
Yes  
**Fix:** Added global currency state later

---

### 7. Comparison Table Logic
**Prompt:**  
"Generate a comparison table for two selected car objects."

**Worked first time?**  
Partially  
**Fix:** Needed normalization of specs structure

---

### 8. Recommendation Logic
**Prompt:**  
"Suggest best car based on family size and usage."

**Worked first time?**  
No  
**Fix:** Too generic — rewrote with explicit rules

---

### 9. Chat UI Component
**Prompt:**  
"Build a floating AI chat widget with message history."

**Worked first time?**  
Yes  
**Fix:** Styling adjustments only

---

### 10. State Synchronization
**Prompt:**  
"Keep UI state in sync with AI-triggered updates across components."

**Worked first time?**  
No  
**Fix:** Switched to centralized state management

---

## Key Realization

Vague prompts waste time. The more structured your prompt, the fewer iterations you need.