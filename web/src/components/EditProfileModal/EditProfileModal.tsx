import { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import './EditProfileModal.css';
import EditPersonalInf from '../EditPersonelInf/EditPersonelInf';
import type { PersonalInformation } from '../EditPersonelInf/EditPersonelInf';
import BaseButton from '../BaseButton/BaseButton';
import EditContact from '../EditContact/EditContact';
import type { Language } from '../EditLanguages/EditLanguages';
import EditLanguages from '../EditLanguages/EditLanguages';
import EditSkills from '../EditSkills/EditSkills';
import type { Skill } from '../EditSkills/EditSkills';
import EditReferences from '../EditReferences/EditReferences';
import type { Reference } from '../EditReferences/EditReferences';
import EditHobbies from '../EditHobbies/EditHobbies';
import type { Hobby } from '../EditHobbies/EditHobbies';
import EditEducations, { type Education } from '../EditEducations/EditEducations';
import EditWorkExperiences, { type WorkExperience} from '../EditWorkExperiences/EditWorkExperiences';
import EditProjects, { type Project } from '../EditProjects/EditProjects';
import EditDocuments, { type Document } from '../EditDocuments/EditDocuments';

export type EditSection =
    | 'Profile'
    | 'Contact'
    | 'Educations'
    | 'WorkExperiences'
    | 'Skills'
    | 'Projects'
    | 'Hobbies'
    | 'Languages'
    | 'Certifications'
    | 'Awards'
    | 'References';

interface EditProfileModalProps {
    section: EditSection;
    data: any;
    onClose: () => void;
    onSave: (
        data: PersonalInformation | Record<string, string | null> | Language[] | Skill[] | Reference[] | Hobby[] |
        Education[] | WorkExperience[] | Project[] | Document[]
    ) => void;
}

const sectionTitles: Record<EditSection, string> = {
    Profile: 'Edit Profile Information',
    Contact: 'Contact Information',
    Educations: 'Edit Education',
    WorkExperiences: 'Edit Work Experience',
    Skills: 'Edit Skills',
    Projects: 'Edit Projects',
    Hobbies: 'Edit Hobbies',
    Languages: 'Edit Languages',
    Certifications: 'Edit Certifications',
    Awards: 'Edit Awards',
    References: 'Edit References'
};

const EditProfileModal = ({
    section,
    data,
    onClose,
    onSave
}: EditProfileModalProps) => {

    const [formData, setFormData] = useState<PersonalInformation>({
        PhotoUrl: data?.PhotoUrl || '',
        PhotoFile: null,
        FirstName: data?.FirstName || '',
        LastName: data?.LastName || '',
        Profession: data?.Profession || '',
        CareerSummary: data?.CareerSummary || '',
        CareerGoals: data?.CareerGoals || ''
    });

    const [contactData, setContactData] = useState<Record<string, string | null>>(
        data ?? {}
    );
    const [languagesData, setLanguagesData] = useState<Language[]>(data ?? []);
    const [skillsData, setSkillsData] = useState<Skill[]>(data ?? []);
    const [referencesData, setReferencesData] = useState<Reference[]>(data ?? []);
    const [hobbiesData, setHobbiesData] = useState<Hobby[]>(data ?? []);
    const [educationsData, setEducationsData] = useState<Education[]>(data ?? []);
    const [workExperiencesData, setWorkExperiencesData] = useState<WorkExperience[]>(data ?? []);
    const [projectsData, setProjectsData] = useState<Project[]>(data ?? []);
    const [certificationsData, setCertificationsData] = useState<Document[]>(data ?? []);
    const [awardsData, setAwardsData] = useState<Document[]>(data ?? []);

    useEffect(() => {
        if (section === 'Profile') {
            setFormData({
                PhotoUrl: data?.PhotoUrl || '',
                PhotoFile: null,
                FirstName: data?.FirstName || '',
                LastName: data?.LastName || '',
                Profession: data?.Profession || '',
                CareerSummary: data?.CareerSummary || '',
                CareerGoals: data?.CareerGoals || ''
            });
        }

        if (section === 'Contact') {
            setContactData(data ?? {});
        }

        if (section === 'Languages') setLanguagesData(data ?? []);
        if (section === 'Hobbies') setHobbiesData(data ?? []);
        if (section === 'Educations') setEducationsData(data ?? []);
        if (section === 'WorkExperiences') setWorkExperiencesData(data ?? []);
        if (section === 'Projects') setProjectsData(data ?? []);
        if (section === 'Skills') setSkillsData(data ?? []);
        if (section === 'References') setReferencesData(data ?? []);
        if (section === 'Certifications') setCertificationsData(data ?? []);
        if (section === 'Awards') setAwardsData(data ?? []);

    }, [data, section]);

    const renderForm = () => {
        switch (section) {
            case 'Profile':
                return (
                    <EditPersonalInf data={formData} onChange={(updatedData) => { setFormData(updatedData); }} />
                );

            case 'Contact':
                return (
                    <EditContact data={data} onChange={(updatedData) => {
                            setContactData(previousData => ({
                                ...previousData,
                                ...updatedData
                            }));
                        }}
                    />
                );

            case 'Educations':
                return (                    
                    <EditEducations data={data} onChange={setEducationsData} />
                );

            case 'WorkExperiences':
                return (
                    <EditWorkExperiences data={data} onChange={setWorkExperiencesData} />
                );

            case 'Skills':
                return (
                    <EditSkills data={data ?? []} onChange={setSkillsData} />
                );

            case 'Projects':
                return (
                    <EditProjects data={data} onChange={setProjectsData} />
                );

            case 'Hobbies':
                return (
                    <EditHobbies data={data} onChange={(updatedData) => setHobbiesData(updatedData)} />
                );

            case 'Languages':
                return (
                    <EditLanguages data={data ?? []} onChange={setLanguagesData} />
                );

            case 'Certifications':
                return (
                    <EditDocuments data={data ?? []} onChange={setCertificationsData} type="certifications" />
                );

            case 'Awards':
                return (
                    <EditDocuments data={data ?? []} onChange={setAwardsData} type="awards" />
                );

            case 'References':
                return (
                    <div>
                        <EditReferences data={data ?? []} onChange={setReferencesData} />
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="edit-modal-overlay" onClick={onClose}>
            <div
                className="edit-modal"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="edit-modal-header">
                    <h2>{sectionTitles[section]}</h2>

                    <button
                        type="button"
                        onClick={onClose}
                        title="Close"
                    >
                        <FiX />
                    </button>
                </div>

                <form
                    className="edit-modal-content"
                    onSubmit={(e) => {
                        e.preventDefault();

                        if (section === 'Contact') {
                            onSave(contactData);
                        } else if (section === 'Languages') {
                            onSave(languagesData);
                        } else if (section === 'Skills') {
                            onSave(skillsData);
                        } else if (section === 'References') {
                            onSave(referencesData);
                        } else if (section === 'Hobbies') {
                            onSave(hobbiesData);
                        }  else if (section === 'Educations') {
                            onSave(educationsData);
                        } 
                        else if (section === 'WorkExperiences') {
                            onSave(workExperiencesData);
                        } 
                        else if (section === 'Projects') {
                            onSave(projectsData);
                        }
                        else if (section === 'Certifications') {
                            onSave(certificationsData);
                        } else if (section === 'Awards') {
                            onSave(awardsData);
                        }else {
                            onSave(formData);
                        }
                    }}
                >
                    {renderForm()}
                    <BaseButton type='submit' title='Save Changes'/>
                </form>
            </div>
        </div>
    );
};

export default EditProfileModal;
