import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import './AddProfile.css';

import Sidebar from '../../../components/Sidebar/Sidebar';
import api from '../../../services/api';

import type { IconType } from 'react-icons';
import { FiMail, FiPhone, FiMapPin, FiGlobe, FiEdit2 } from 'react-icons/fi';
import { SiGithub, SiX, SiMedium, SiHashnode, SiDribbble, SiBehance,
    SiStackoverflow, SiZoom, SiDiscord } from 'react-icons/si';
import { FaLinkedin, FaSkype, FaDev } from 'react-icons/fa';

import EditProfileModal, { type EditSection} from '../../../components/EditProfileModal/EditProfileModal';
import type { PersonalInformation } from '../../../components/EditPersonelInf/EditPersonelInf';
import type { Language } from '../../../components/EditLanguages/EditLanguages';
import type { Skill } from '../../../components/EditSkills/EditSkills';
import type { Reference } from '../../../components/EditReferences/EditReferences';
import type { Hobby } from '../../../components/EditHobbies/EditHobbies';
import type { Education } from '../../../components/EditEducations/EditEducations';
import type { WorkExperience } from '../../../components/EditWorkExperiences/EditWorkExperiences';
import type { Project } from '../../../components/EditProjects/EditProjects';
import type { Document } from '../../../components/EditDocuments/EditDocuments';
import BaseButton from '../../../components/BaseButton/BaseButton';

interface Profile {
    Id: number;
    UserId: number;
    Name: string;
    PhotoUrl: string | null;

    PersonalInformation: {
        FirstName: string;
        LastName: string;
        Profession: string | null;
    } | null;

    Summary: {
        CareerSummary: string | null;
        CareerGoals: string | null;
    } | null;

    Contact: Contact | null;

    Educations: {
        Id?: number;
        SchoolName: string;
        Department: string;
        Degree: string;
        Location: string;
        StartDate: string;
        EndDate: string | null;
        IsPresent: boolean;
    }[];

    WorkExperiences: {
        Id?: number;
        CompanyName: string;
        Position: string;
        Location: string;
        StartDate: string;
        EndDate: string | null;
        IsPresent: boolean;
        Responsibilities: {
            Id?: number;
            Description: string;
        }[];
    }[];

    Projects: {
        Id?: number;
        ProjectName: string;
        Date: string | null;
        Link: string | null;
        Descriptions: {
            Id?: number;
            Description: string;
        }[];
    }[];

    Skills: {
        Id?: number;
        Title: string;
        Items: {
            Id?: number;
            Name: string;
        }[];
    }[];

    Languages: {
        Id?: number;
        Name: string;
        Levels: string;
    }[];

    Certifications: {
        Id?: number;
        Title: string;
        Issuer: string;
        Date: string | null;
    }[];

    Awards: {
        Id?: number;
        Title: string;
        Issuer: string;
        Date: string | null;
    }[];

    Hobbies: {
        Id?: number;
        Name: string;
    }[];

    References: {
        Id?: number;
        Name: string;
        Position: string;
        Contact: string;
    }[];
}

interface Contact {
    Id: number;
    ProfileId: number;
    CreatedAt: string;
    UpdatedAt: string | null;
    [key: string]: string | number | null;
}

const serverUrl = (import.meta.env.VITE_API_URL ?? '').replace(/\/api\/?$/, '');

const contactIcons: Record<string, IconType> = {
    Email: FiMail,
    Phone: FiPhone,
    Location: FiMapPin,
    LinkedIn: FaLinkedin,
    GitHub: SiGithub,
    Portfolio: FiGlobe,
    X: SiX,
    Medium: SiMedium,
    DevTo: FaDev,
    Hashnode: SiHashnode,
    Dribbble: SiDribbble,
    Behance: SiBehance,
    StackOverflow: SiStackoverflow,
    Skype: FaSkype,
    Zoom: SiZoom,
    Discord: SiDiscord
};

const formatContactValue = (key: string, value: string) => {
    const urlFields = [
        'LinkedIn',
        'GitHub',
        'Portfolio',
        'X',
        'Medium',
        'DevTo',
        'Hashnode',
        'Dribbble',
        'Behance',
        'StackOverflow',
        'Skype',
        'Zoom',
        'Discord'
    ];

    if (!urlFields.includes(key)) return value;

    try {
        const url = new URL(
            value.startsWith('http') ? value : `https://${value}`
        );

        if (key === 'Portfolio') {
            return url.hostname.replace(/^www\./, '');
        }

        return url.pathname.replace(/\/$/, '') || url.hostname;
    } catch {
        return value;
    }
};

const formatDate = (date: string | null) => {
    if (!date) return 'Present';

    return new Date(date).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
    });
};

const createEmptyProfile = (): Profile => ({
    Id: 0,
    UserId: 0,
    Name: '',
    PhotoUrl: null,

    PersonalInformation: {
        FirstName: '',
        LastName: '',
        Profession: ''
    },

    Summary: {
        CareerSummary: '',
        CareerGoals: ''
    },

    Contact: {
        Id: 0,
        ProfileId: 0,
        CreatedAt: '',
        UpdatedAt: null,
        Email: '',
        Phone: '',
        Location: '',
        LinkedIn: '',
        GitHub: '',
        Portfolio: '',
        X: '',
        Medium: '',
        DevTo: '',
        Hashnode: '',
        Dribbble: '',
        Behance: '',
        StackOverflow: '',
        Skype: '',
        Zoom: '',
        Discord: ''
    },

    Educations: [],
    WorkExperiences: [],
    Projects: [],
    Skills: [],
    Languages: [],
    Certifications: [],
    Awards: [],
    Hobbies: [],
    References: []
});

const AddProfile = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // URL'de copyFrom parametresi varsa kopyalama modundayız.
    const copyFrom = searchParams.get('copyFrom');
    const [profile, setProfile] = useState<Profile>(createEmptyProfile());
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editSection, setEditSection] = useState<EditSection>('Profile');
    const [editData, setEditData] = useState<any>(null);
    const [isEditingName, setIsEditingName] = useState(false);
    const [profileName, setProfileName] = useState(' ');
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!copyFrom) {
            setProfile(createEmptyProfile());
            setProfileName('');
            setLoading(false);
            return;
        }

        const fetchProfile = async () => {
            try {
                const response = await api.get(`/profiles/${copyFrom}`);

                setProfile(response.data.data);
                setProfileName(response.data.data.Name ?? '');
            } catch (error) {
                console.error('Profile could not be retrieved:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [copyFrom]);

    console.log(profile)    

    if (loading) {
        return <p>Loading profile...</p>;
    }
    
    const handleCreateProfile = async () => {
        if (!profile.Name.trim()) {
            alert('Please enter a profile name.');
            return;
        }

        try {
            setIsSaving(true);

            const profileData = {
                Name: profile.Name,
                PhotoUrl: photoFile ? null : profile.PhotoUrl,

                PersonalInformation: {
                    FirstName: profile.PersonalInformation?.FirstName ?? '',
                    LastName: profile.PersonalInformation?.LastName ?? '',
                    Profession: profile.PersonalInformation?.Profession ?? ''
                },

                Summary: {
                    CareerSummary: profile.Summary?.CareerSummary ?? '',
                    CareerGoals: profile.Summary?.CareerGoals ?? ''
                },

                Contact: {
                    Email: profile.Contact?.Email ?? '',
                    Phone: profile.Contact?.Phone ?? '',
                    Location: profile.Contact?.Location ?? '',
                    LinkedIn: profile.Contact?.LinkedIn ?? '',
                    GitHub: profile.Contact?.GitHub ?? '',
                    Portfolio: profile.Contact?.Portfolio ?? '',
                    X: profile.Contact?.X ?? '',
                    Medium: profile.Contact?.Medium ?? '',
                    DevTo: profile.Contact?.DevTo ?? '',
                    Hashnode: profile.Contact?.Hashnode ?? '',
                    Dribbble: profile.Contact?.Dribbble ?? '',
                    Behance: profile.Contact?.Behance ?? '',
                    StackOverflow: profile.Contact?.StackOverflow ?? '',
                    Skype: profile.Contact?.Skype ?? '',
                    Zoom: profile.Contact?.Zoom ?? '',
                    Discord: profile.Contact?.Discord ?? ''
                },

                Educations: profile.Educations.map(({ Id, ...education }) => education),

                WorkExperiences: profile.WorkExperiences.map(
                    ({ Id, ...experience }) => ({
                        ...experience,
                        Responsibilities: experience.Responsibilities.map(
                            ({ Id, ...responsibility }) => responsibility
                        )
                    })
                ),

                Projects: profile.Projects.map(({ Id, ...project }) => ({
                    ...project,
                    Descriptions: project.Descriptions.map(
                        ({ Id, ...description }) => description
                    )
                })),

                Skills: profile.Skills.map(({ Id, ...skill }) => ({
                    ...skill,
                    Items: skill.Items.map(({ Id, ...item }) => item)
                })),

                Languages: profile.Languages.map(({ Id, ...language }) => language),

                Certifications: profile.Certifications.map(
                    ({ Id, ...certification }) => certification
                ),

                Awards: profile.Awards.map(({ Id, ...award }) => award),

                Hobbies: profile.Hobbies.map(({ Id, ...hobby }) => hobby),

                References: profile.References.map(({ Id, ...reference }) => reference)
            };

            const response = await api.post('/profiles', profileData);

            const createdProfile = response.data.data;

            // Yeni fotoğraf seçilmişse oluşturulan profile yükle.
            if (photoFile) {
                const formData = new FormData();
                formData.append('photo', photoFile);

                await api.post(
                    `/profiles/${createdProfile.Id}/photo`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );
            }

            console.log('Profile created successfully:', createdProfile);
            navigate('/profiles');

        } catch (error) {
            console.error('Profile creation error:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveProfile = (updatedData: PersonalInformation) => {
        const {
            FirstName,
            LastName,
            Profession,
            CareerSummary,
            CareerGoals,
            PhotoFile
        } = updatedData as PersonalInformation & {
            CareerSummary?: string;
            CareerGoals?: string;
            PhotoFile?: File | null;
        };

        setProfile(prev => ({
            ...prev,
            PersonalInformation: {
                ...(prev.PersonalInformation ?? {}),
                FirstName,
                LastName,
                Profession
            },
            Summary: {
                ...(prev.Summary ?? {}),
                CareerSummary: CareerSummary ?? prev.Summary?.CareerSummary ?? '',
                CareerGoals: CareerGoals ?? prev.Summary?.CareerGoals ?? ''
            }
        }));

        if (PhotoFile) {
            setPhotoFile(PhotoFile);
        }

        setIsEditModalOpen(false);
    };
    
    const handleSaveContact = (
        updatedData: Record<string, string | null>
    ) => {
        setProfile(prev => ({
            ...prev,
            Contact: {
                ...(prev.Contact ?? {}),
                ...updatedData
            } as Contact
        }));

        setIsEditModalOpen(false);
    };

    const handleSaveLanguages = (
        updatedData: Language[]
    ) => {
        setProfile(prev => ({
            ...prev,
            Languages: updatedData
        }));

        setIsEditModalOpen(false);
    };

    const handleSaveSkills = (updatedData: Skill[]) => {
        setProfile(prev => ({
            ...prev,
            Skills: updatedData
        }));

        setIsEditModalOpen(false);
    };

    const handleSaveReferences = (updatedData: Reference[]) => {
        setProfile(prev => ({
            ...prev,
            References: updatedData
        }));

        setIsEditModalOpen(false);
    };

    const handleSaveHobbies = (updatedData: Hobby[]) => {
        setProfile(prev => ({
            ...prev,
            Hobbies: updatedData
        }));

        setIsEditModalOpen(false);
    };

    const handleSaveEducations = (updatedData: Education[]) => {
        setProfile(prev => ({
            ...prev,
            Educations: updatedData
        }));

        setIsEditModalOpen(false);
    };

    const handleSaveWorkExperiences = (updatedData: WorkExperience[]) => {
        setProfile(prev => ({
            ...prev,
            WorkExperiences: updatedData
        }));

        setIsEditModalOpen(false);
    };

    const handleSaveCertifications = (updatedData: Document[]) => {
        setProfile(prev => ({
            ...prev,
            Certifications: updatedData
        }));

        setIsEditModalOpen(false);
    };

    const handleSaveAwards = (updatedData: Document[]) => {
        setProfile(prev => ({
            ...prev,
            Awards: updatedData
        }));

        setIsEditModalOpen(false);
    };

    const handleSaveProjects = (updatedData: Project[]) => {
        setProfile(prev => ({
            ...prev,
            Projects: updatedData
        }));

        setIsEditModalOpen(false);
    };

    const personalInfo = profile?.PersonalInformation ?? {
        FirstName: '',
        LastName: '',
        Profession: ''
    };

    const summary = profile?.Summary ?? {
        CareerSummary: '',
        CareerGoals: ''
    };

    const contact = profile?.Contact ?? {};
    const educations = profile?.Educations ?? [];
    const workExperiences = profile?.WorkExperiences ?? [];
    const projects = profile?.Projects ?? [];
    const skills = profile?.Skills ?? [];
    const languages = profile?.Languages ?? [];
    const certifications = profile?.Certifications ?? [];
    const awards = profile?.Awards ?? [];
    const hobbies = profile?.Hobbies ?? [];
    const references = profile?.References ?? [];

    const photoPreview = photoFile
        ? URL.createObjectURL(photoFile)
        : profile.PhotoUrl
            ? `${serverUrl}${profile.PhotoUrl}`
            : null;

    return (
        <div className="add-profile-page">
            <Sidebar />
            <main className="add-profile-content">
                <div className="profile-page-header">
                    {isEditingName ? (
                        <input
                            type="text"
                            value={profileName}
                            onChange={(e) => {
                                const newName = e.target.value;
                                setProfileName(newName);
                                setProfile(prev => ({
                                    ...prev,
                                    Name: newName
                                }));
                            }}
                            autoFocus
                        />
                    ) : (
                        <h1>{profileName}</h1>
                    )}

                    <button
                        type="button"
                        className="profile-edit-button"
                        title="Edit Profile Name"
                        onClick={() => {
                            if (isEditingName) {
                                setIsEditingName(false);
                            } else {
                                setIsEditingName(true);
                            }
                        }}
                    >
                        <FiEdit2 />
                    </button>

                </div>

                <div className="profile-layout">
                    <div className="profile-header">
                        <button
                            className="profile-edit-button"
                            onClick={() => {
                                setEditSection('Profile');
                                setEditData({
                                    ...personalInfo,
                                    ...summary
                                });
                                setIsEditModalOpen(true);
                            }}
                            title="Edit Profile"
                        >
                            <FiEdit2 />
                        </button>

                        {/* Personal Information */}
                        <div className="personal-info">
                            {photoPreview ? (
                                <img
                                    className="profile-photo"
                                    src={photoPreview}
                                    alt={`${personalInfo.FirstName} ${personalInfo.LastName}`}
                                />
                            ) : (
                                <div className="my-profile-avatar">
                                    {personalInfo.FirstName.charAt(0)}
                                    {personalInfo.LastName.charAt(0)}
                                </div>
                            )}

                            <div className="profile-personal-info">
                                <h2>
                                    {personalInfo.FirstName} {personalInfo.LastName}
                                </h2>
                                <p>{personalInfo.Profession}</p>
                            </div>
                        </div>

                        <div>
                            {/* Career Information */}
                            <section>
                                <h2>Career Summary</h2>
                                {summary?.CareerSummary && ( <p>{summary.CareerSummary}</p> )}

                            </section>
                            <section>
                                <h2>Career Goals</h2>
                                {summary?.CareerGoals && ( <p>{summary.CareerGoals}</p> )}

                            </section>
                        </div>

                        {isEditModalOpen && (
                            <EditProfileModal
                                section={editSection}
                                data={editData}
                                onClose={() => setIsEditModalOpen(false)}
                                onSave={(updatedData) => {
                                    if (editSection === 'Profile') {
                                        handleSaveProfile(updatedData as PersonalInformation);
                                    } else if (editSection === 'Contact') {
                                        handleSaveContact(updatedData as Record<string, string | null>);
                                    } else if (editSection === 'Languages') {
                                        handleSaveLanguages(updatedData as Language[]);
                                    } else if (editSection === 'Skills') {
                                        handleSaveSkills(updatedData as Skill[]);
                                    } else if (editSection === 'References') {
                                        handleSaveReferences(updatedData as Reference[]);
                                    } else if (editSection === 'Hobbies') {
                                        handleSaveHobbies(updatedData as Hobby[]);
                                    } else if (editSection === 'Educations') {
                                        handleSaveEducations(updatedData as Education[]);
                                    } else if (editSection === 'WorkExperiences') {
                                        handleSaveWorkExperiences(updatedData as WorkExperience[]);
                                    } else if (editSection === 'Projects') {
                                        handleSaveProjects(updatedData as Project[]);
                                    } else if (editSection === 'Certifications') {
                                        handleSaveCertifications(updatedData as Document[]);
                                    } else if (editSection === 'Awards') {
                                        handleSaveAwards(updatedData as Document[]);
                                    }
                                }}
                            />
                        )}
                    </div>

                    {/* Left */}
                    <div className="profile-left">

                        {/* Contact */}
                        <section className="profile-contact">
                            <button
                                className="profile-edit-button"
                                onClick={() => {
                                    setEditSection('Contact');
                                    setEditData(contact);
                                    setIsEditModalOpen(true);
                                }}
                                title="Edit Contact"
                            >
                                <FiEdit2 />
                            </button>

                            <h2>Contact</h2>

                            {Object.entries(contact).map(([key, value]) => {
                                const Icon = contactIcons[key];
                                const isNotLink = ['Phone', 'Location'].includes(key);

                                if (!value || !Icon) return null;

                                return (
                                    <div className="contact-item" key={key}>
                                        <Icon />

                                        {isNotLink ? (
                                            <span>{String(value)}</span>
                                        ) : (
                                            <a
                                                href={
                                                    String(value).startsWith('http')
                                                        ? String(value)
                                                        : `https://${value}`
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {formatContactValue(key, String(value))}
                                            </a>
                                        )}
                                    </div>
                                );
                            })}
                        </section>

                        {/* Languages */}
                        {Array.isArray(languages) && (
                            <section>
                                <button
                                    className="profile-edit-button"
                                    onClick={() => {
                                        setEditSection('Languages');
                                        setEditData(languages);
                                        setIsEditModalOpen(true);
                                    }}
                                    title="Edit Languages"
                                >
                                    <FiEdit2 />
                                </button>

                                <hr className="profile-divider" />
                                <h2>Languages</h2>

                                {languages.map(lang => (
                                    <ul className="respon" key={lang.Id}>
                                        <li>
                                            {lang.Name} - {lang.Levels}
                                        </li>
                                    </ul>
                                ))}
                            </section>
                        )}

                        {/* Skills */}
                        {Array.isArray(skills) && (
                            <section>
                                <button
                                    className="profile-edit-button"
                                    onClick={() => {
                                        setEditSection('Skills');
                                        setEditData(skills);
                                        setIsEditModalOpen(true);
                                    }}
                                    title="Edit Skills"
                                >
                                    <FiEdit2 />
                                </button>

                                <hr className="profile-divider" />
                                <h2>Skills</h2>

                                {skills.map(pro => (
                                    <div className="profile-item" key={pro.Id}>
                                        <h3>{pro.Title}</h3>

                                        {pro.Items?.length > 0 && (
                                            <div className="skill-list">
                                                {pro.Items.map(item => (
                                                    <span className="skill-item" key={item.Id}>
                                                        {item.Name}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </section>
                        )}

                        {/* References */}
                        {Array.isArray(references) && (
                            <section>
                                <button
                                    className="profile-edit-button"
                                    onClick={() => {
                                        setEditSection('References');
                                        setEditData(references);
                                        setIsEditModalOpen(true);
                                    }}
                                    title="Edit References"
                                >
                                    <FiEdit2 />
                                </button>

                                <hr className="profile-divider" />
                                <h2>References</h2>

                                {references.map(myRef => (
                                    <div className="profile-item" key={myRef.Id}>
                                        <h3>{myRef.Name}</h3>
                                        <p>{myRef.Position}</p>
                                        <p>{myRef.Contact}</p>
                                    </div>
                                ))}
                            </section>
                        )}

                        {/* Hobbies */}
                        {Array.isArray(hobbies) && (
                            <section>
                                <button
                                    className="profile-edit-button"
                                    onClick={() => {
                                        setEditSection('Hobbies');
                                        setEditData(hobbies);
                                        setIsEditModalOpen(true);
                                    }}
                                    title="Edit Hobbies"
                                >
                                    <FiEdit2 />
                                </button>

                                <hr className="profile-divider" />
                                <h2>Hobbies</h2>

                                <div className="skill-list">
                                    {hobbies.map(hobby => (
                                        <span className="skill-item" key={hobby.Id}>
                                            {hobby.Name}
                                        </span>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    <div className="profile-right">

                        {/* Educations */}
                        {Array.isArray(educations) && (
                            <section>
                                <button
                                    className="profile-edit-button"
                                    onClick={() => {
                                        setEditSection('Educations');
                                        setEditData(educations);
                                        setIsEditModalOpen(true);
                                    }}
                                    title="Edit Educations"
                                >
                                    <FiEdit2 />
                                </button>

                                <h2>Educations</h2>

                                {educations.map(education => (
                                    <div className="profile-item" key={education.Id}>
                                        <h3>{education.SchoolName}</h3>
                                        <p>{education.Degree} - {education.Department}</p>
                                        <p>{education.Location}</p>
                                        <span>
                                            {formatDate(education.StartDate)} -{' '}
                                            {education.IsPresent
                                                ? 'Present'
                                                : formatDate(education.EndDate)}
                                        </span>
                                    </div>
                                ))}
                            </section>
                        )}

                        {/* Work Experiences */}
                        {Array.isArray(workExperiences) && (
                            <section>
                                <button
                                    className="profile-edit-button"
                                    onClick={() => {
                                        setEditSection('WorkExperiences');
                                        setEditData(workExperiences);
                                        setIsEditModalOpen(true);
                                    }}
                                    title="Edit Work Experiences"
                                >
                                    <FiEdit2 />
                                </button>

                                <hr className="profile-divider" />
                                <h2>Work Experience</h2>

                                {workExperiences.map(exp => (
                                    <div className="profile-item" key={exp.Id}>
                                        <h3>{exp.Position}</h3>
                                        <p>{exp.CompanyName} - {exp.Location}</p>

                                        <span>
                                            {formatDate(exp.StartDate)} -{' '}
                                            {exp.IsPresent
                                                ? 'Present'
                                                : formatDate(exp.EndDate)}
                                        </span>

                                        {exp.Responsibilities?.length > 0 && (
                                            <ul className="respon">
                                                {exp.Responsibilities.map(item => (
                                                    <li key={item.Id}>
                                                        {item.Description}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ))}
                            </section>
                        )}

                        {/* Projects */}
                        {Array.isArray(projects) && (
                            <section>
                                <button
                                    className="profile-edit-button"
                                    onClick={() => {
                                        setEditSection('Projects');
                                        setEditData(projects);
                                        setIsEditModalOpen(true);
                                    }}
                                    title="Edit Projects"
                                >
                                    <FiEdit2 />
                                </button>

                                <hr className="profile-divider" />
                                <h2>Projects</h2>

                                {projects.map(pro => (
                                    <div className="profile-item" key={pro.Id}>
                                        <h3>{pro.ProjectName}</h3>

                                        {pro.Link && (
                                            <a
                                                href={pro.Link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {pro.Link}
                                            </a>
                                        )}

                                        <span>{formatDate(pro.Date)}</span>

                                        {pro.Descriptions?.length > 0 && (
                                            <ul className="respon">
                                                {pro.Descriptions.map(item => (
                                                    <li key={item.Id}>
                                                        {item.Description}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ))}
                            </section>
                        )}

                        {/* Certifications */}
                        {Array.isArray(certifications) && (
                            <section>
                                <button
                                    className="profile-edit-button"
                                    onClick={() => {
                                        setEditSection('Certifications');
                                        setEditData(certifications);
                                        setIsEditModalOpen(true);
                                    }}
                                    title="Edit Certifications"
                                >
                                    <FiEdit2 />
                                </button>

                                <hr className="profile-divider" />
                                <h2>Certifications</h2>

                                {certifications.map(certf => (
                                    <div className="profile-item" key={certf.Id}>
                                        <h3>{certf.Title}</h3>
                                        <p>{certf.Issuer}</p>
                                        <span>{formatDate(certf.Date)}</span>
                                    </div>
                                ))}
                            </section>
                        )}

                        {/* Awards */}
                        {Array.isArray(awards) && (
                            <section>
                                <button
                                    className="profile-edit-button"
                                    onClick={() => {
                                        setEditSection('Awards');
                                        setEditData(awards);
                                        setIsEditModalOpen(true);
                                    }}
                                    title="Edit Awards"
                                >
                                    <FiEdit2 />
                                </button>

                                <hr className="profile-divider" />
                                <h2>Awards</h2>

                                {awards.map(award => (
                                    <div className="profile-item" key={award.Id}>
                                        <h3>{award.Title}</h3>
                                        <p>{award.Issuer}</p>
                                        <span>{formatDate(award.Date)}</span>
                                    </div>
                                ))}
                            </section>
                        )}
                    </div>
                </div>
                <div className="create-profile-button">
                    <BaseButton
                        title={isSaving ? "Creating..." : "Create Profile"}
                        onClick={handleCreateProfile}
                        disabled={isSaving}
                    />
                </div>
            </main>

        </div>
    );
};

export default AddProfile;