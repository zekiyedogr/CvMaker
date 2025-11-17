# 📄 CV Builder App
A professional CV creation app built with React Native, Redux, and a modular architecture. Users can create, manage, customize, and export multiple CVs using dynamic profiles and templates.

---

## 🚀 Overview
The app provides a complete CV workflow:

1. Create a profile with all personal, contact, education, work experience, project, skill, language, certification, award, hobby, and reference data.
2. Manage multiple profiles (edit, delete, clone).
3. Select a CV template.
4. Customize template layout, colors, fonts, section visibility, and language (titles only).
5. Save or export the CV as a PDF.
6. View and edit previously saved CVs.

---

## 🧩 Features

### 1. Profile Creation
On first launch, users are directed to the Profile Creation screen. Profiles contain nested and dynamic data:

- Personal Information
- Contact Details
- Career Summary & Goals
- Education
- Work Experience
- Projects
- Skills
- Languages
- Certifications
- Awards
- Hobbies
- References
<img width="360" height="760" alt="Screenshot_1763400870" src="https://github.com/user-attachments/assets/c8bee2f4-0e82-4471-82f2-1be6ff6c944b" />
<img width="360" height="760" alt="Screenshot_1763401493" src="https://github.com/user-attachments/assets/fa4a1c05-44f8-4543-9e21-65638109ae2c" />
<img width="360" height="760" alt="Screenshot_1763401550" src="https://github.com/user-attachments/assets/18385481-3760-473e-997a-be99e4f7f690" />


### 2. Profiles Screen
All profiles are displayed as cards with a summary. Users can:

- Edit profiles
- Delete profiles
- Clone profiles (to create variations without re-entering shared information)
<img width="360" height="760" alt="Screenshot_1763402073" src="https://github.com/user-attachments/assets/b04d96cc-9755-4d8c-870c-4a8407986e53" />

### 3. Make CV
Selected profiles can be used to generate CVs in a chosen template.
<img width="360" height="760" alt="Screenshot_1763401817" src="https://github.com/user-attachments/assets/55e1df09-2f36-480c-8891-e8a3185d1738" />

### 4. Template Selection & Customization
- **Language**: Changes only section titles (e.g., "Work Experience" → "Deneyimler")
- **Typography**: Customize fonts for titles and content
- **Design**: Adjust colors, font sizes, and layout
- **Content Control**: Show/hide entire sections or individual items independently
<img width="360" height="760" alt="Screenshot_1763401888" src="https://github.com/user-attachments/assets/6e3e5a19-3709-4d6b-b46b-0b8262b2f460" />

### 5. Save or Export
- Save customized CVs for later editing
- Export CVs directly as PDF

### 6. Saved CVs Screen
View, edit, and re-download previously created CVs.

---

## 🛠 Technologies Used
- React Native
- Redux / Redux Toolkit
- Modular architecture
- Dynamic nested form structure
- PDF rendering & export

---

## 📁 Example Profile Structure

```js
const [profile, setProfile] = useState({
  id: Date.now(),
  name: '',
  photo: null,
  personalInformation: { firstName: '', lastName: '', profession: '' },
  contact: {
    email: '', phone: '', location: '',
    linkedin: '', github: '', portfolio: '',
    x: '', medium: '', devto: '', hashnode: '', dribbble: '', behance: '', stackOverflow: '',
    skype: '', zoom: '', discord: '',
  },
  summary: { careerSummary: '', careerGoals: '' },
  education: [
    { id: Date.now() + Math.random(), schoolName: '', department: '', location: '', startDate: null, endDate: null, degree: '', fieldOfStudy: '', present: '' }
  ],
  workExperience: [
    { id: Date.now() + Math.random(), companyName: '', position: '', location: '', startDate: null, endDate: null, responsibilities: '' }
  ],
  projects: [
    { id: Date.now() + Math.random(), projectName: '', date: null, description: '', link: '' }
  ],
  skills: [
    { id: Date.now() + Math.random(), title: '', items: [ { id: Date.now() + Math.random(), name: '' } ] }
  ],
  languages: [
    { id: Date.now() + Math.random(), name: '', levels: 'Beginner' }
  ],
  certifications: [
    { id: Date.now() + Math.random(), title: '', issuer: '', date: null }
  ],
  awards: [
    { id: Date.now() + Math.random(), title: '', issuer: '', date: null }
  ],
  hobbies: [
    { id: Date.now() + Math.random(), name: '' }
  ],
  references: [
    { id: Date.now() + Math.random(), name: '', position: '', contact: '' }
  ],
});
