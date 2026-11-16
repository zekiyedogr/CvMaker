import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import './MyProfile.css';
import api from '../../../services/api';
import Sidebar from '../../../components/Sidebar/Sidebar';

import type { IconType } from 'react-icons';
import { FiMail, FiPhone, FiMapPin, FiGlobe } from 'react-icons/fi';
import { SiGithub, SiX, SiMedium, SiHashnode, SiDribbble, SiBehance,
    SiStackoverflow, SiZoom, SiDiscord } from 'react-icons/si';
import { FaLinkedin, FaSkype, FaDev } from 'react-icons/fa';

import EditProfileModal, { type EditSection} from '../../../components/EditProfileModal/EditProfileModal';
import IconButton from '../../../components/IconButton/IconButton';

import type { PersonalInformation } from '../../../components/EditPersonelInf/EditPersonelInf';
import type { Language } from '../../../components/EditLanguages/EditLanguages';
import type { Skill } from '../../../components/EditSkills/EditSkills';
import type { Reference } from '../../../components/EditReferences/EditReferences';
import type { Hobby } from '../../../components/EditHobbies/EditHobbies';
import type { Education } from '../../../components/EditEducations/EditEducations';
import type { WorkExperience } from '../../../components/EditWorkExperiences/EditWorkExperiences';
import type { Project } from '../../../components/EditProjects/EditProjects';
import type { Document } from '../../../components/EditDocuments/EditDocuments';

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
        Id: number;
        SchoolName: string;
        Department: string;
        Degree: string;
        Location: string;
        StartDate: string;
        EndDate: string | null;
        IsPresent: boolean;
    }[];

    WorkExperiences: {
        Id: number;
        CompanyName: string;
        Position: string;
        Location: string;
        StartDate: string;
        EndDate: string | null;
        IsPresent: boolean;
        Responsibilities: {
            Id: number;
            Description: string;
        }[];
    }[];

    Projects: {
        Id: number;
        ProjectName: string;
        Date: string | null;
        Link: string | null;
        Descriptions: {
            Id: number;
            Description: string;
        }[];
    }[];

    Skills: {
        Id: number;
        Title: string;
        Items: {
            Id: number;
            Name: string;
        }[];
    }[];

    Languages: {
        Id: number;
        Name: string;
        Levels: string;
    }[];

    Certifications: {
        Id: number;
        Title: string;
        Issuer: string;
        Date: string | null;
    }[];

    Awards: {
        Id: number;
        Title: string;
        Issuer: string;
        Date: string | null;
    }[];

    Hobbies: {
        Id: number;
        Name: string;
    }[];

    References: {
        Id: number;
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

const MyProfile = () => {
    const { id } = useParams();

    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editSection, setEditSection] = useState<EditSection>('Profile');
    const [editData, setEditData] = useState<any>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get(`/profiles/${id}`);
                setProfile(response.data.data);
            } catch (error) {
                console.error('Profile could not be retrieved:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [id]);

    if (loading) {
        return <p>Loading profile...</p>;
    }

    if (!profile) {
        return <p>Profile not found.</p>;
    }
    
    const handleSaveProfile = async (updatedData: PersonalInformation) => {
        try {
            // Update profile information
            await api.patch(`/profiles/${id}`, {
                PersonalInformation: {
                    FirstName: updatedData.FirstName,
                    LastName: updatedData.LastName,
                    Profession: updatedData.Profession
                },
                Summary: {
                    CareerSummary: updatedData.CareerSummary,
                    CareerGoals: updatedData.CareerGoals
                }
            });

            // Upload profile photo if a new photo was selected
            if (updatedData.PhotoFile) {
                const formData = new FormData();

                formData.append('photo', updatedData.PhotoFile);

                await api.post(`/profiles/${id}/photo`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }

            // Retrieve updated profile
            const response = await api.get(`/profiles/${id}`);
            setProfile(response.data.data);

            setIsEditModalOpen(false);

        } catch (error) {
            console.error('Profile update error:', error);
        }
    };
    
    const handleSaveContact = async (
        updatedData: Record<string, string | null>
    ) => {
        try {
            const contactData = {
                Email: updatedData.Email,
                Phone: updatedData.Phone,
                Location: updatedData.Location,
                LinkedIn: updatedData.LinkedIn,
                GitHub: updatedData.GitHub,
                Portfolio: updatedData.Portfolio,
                X: updatedData.X,
                Medium: updatedData.Medium,
                DevTo: updatedData.DevTo,
                Hashnode: updatedData.Hashnode,
                Dribbble: updatedData.Dribbble,
                Behance: updatedData.Behance,
                StackOverflow: updatedData.StackOverflow,
                Skype: updatedData.Skype,
                Zoom: updatedData.Zoom,
                Discord: updatedData.Discord
            };

            // Remove fields that were not changed
            const filteredContactData = Object.fromEntries(
                Object.entries(contactData).filter(
                    ([_, value]) => value !== undefined
                )
            );

            await api.patch(`/profiles/${id}/contact`, filteredContactData);

            const response = await api.get(`/profiles/${id}`);
            setProfile(response.data.data);

            setIsEditModalOpen(false);
        } catch (error) {
            console.error('Contact update error:', error);
        }
    };

    const handleSaveLanguages = async (updatedData: Language[]) => {
        try {
            await api.patch(`/profiles/${id}/languages`, updatedData);

            const response = await api.get(`/profiles/${id}`);
            setProfile(response.data.data);
            setIsEditModalOpen(false);

        } catch (error) {
            console.error('Languages update error:', error);
        }
    };

    const handleSaveSkills = async (updatedData: Skill[]) => {
        try {
            await api.patch(`/profiles/${id}/skills`, updatedData);

            const response = await api.get(`/profiles/${id}`);
            setProfile(response.data.data);
            setIsEditModalOpen(false);

        } catch (error) {
            console.error('Skills update error:', error);
        }
    };

    const handleSaveReferences = async (updatedData: Reference[]) => {
        try {
            await api.patch(`/profiles/${id}/references`, updatedData);

            const response = await api.get(`/profiles/${id}`);
            setProfile(response.data.data);
            setIsEditModalOpen(false);
        } catch (error) {
            console.error('References update error:', error);
        }
    };

    const handleSaveHobbies = async (updatedData: Hobby[]) => {
        try {
            await api.patch(`/profiles/${id}/hobbies`, updatedData);

            const response = await api.get(`/profiles/${id}`);
            setProfile(response.data.data);
            setIsEditModalOpen(false);
        } catch (error) {
            console.error('Hobbies update error:', error);
        }
    };

    const handleSaveEducations = async (updatedData: Education[]) => {
        try {
            await api.patch(`/profiles/${id}/educations`, updatedData);

            const response = await api.get(`/profiles/${id}`);
            setProfile(response.data.data);
            setIsEditModalOpen(false);
        } catch (error) {
            console.error('Educations update error:', error);
        }
    };

    const handleSaveWorkExperiences = async (updatedData: WorkExperience[]) => {
        try {
            await api.patch(`/profiles/${id}/work-experiences`, updatedData);

            const response = await api.get(`/profiles/${id}`);
            setProfile(response.data.data);

            setIsEditModalOpen(false);

        } catch (error) {
            console.error('Work experiences update error:', error);
        }
    };

    const handleSaveCertifications = async (updatedData: Document[]) => {
        try {
            await api.patch(`/profiles/${id}/certifications`, updatedData);

            const response = await api.get(`/profiles/${id}`);
            setProfile(response.data.data);

            setIsEditModalOpen(false);
        } catch (error) {
            console.error('Certifications update error:', error);
        }
    };

    const handleSaveAwards = async (updatedData: Document[]) => {
        try {
            await api.patch(`/profiles/${id}/awards`, updatedData);

            const response = await api.get(`/profiles/${id}`);
            setProfile(response.data.data);

            setIsEditModalOpen(false);
        } catch (error) {
            console.error('Awards update error:', error);
        }
    };

    const handleSaveProjects = async (updatedData: Project[]) => {
        try {
            await api.patch(`/profiles/${id}/projects`, updatedData);

            const response = await api.get(`/profiles/${id}`);
            setProfile(response.data.data);

            setIsEditModalOpen(false);

        } catch (error) {
            console.error('Projects update error:', error);
        }
    };

    const personalInfo = profile.PersonalInformation;
    const summary = profile.Summary;
    const contact = profile.Contact ?? {};


    return (
        <div className="my-profile-page">
            <Sidebar />

            <main className="my-profile-content">
                <div className="profile-page-header">
                    <h1>{profile.Name}</h1>
                </div>

                <div className="profile-layout">
                    <div className="profile-header">
                        <div className="profile-edit-button">
                            <IconButton
                                icon="edit"
                                onClick={() => {
                                    setEditSection('Profile');
                                    setEditData({
                                        ...personalInfo,
                                        ...summary
                                    });
                                    setIsEditModalOpen(true);
                                }}
                            />
                        </div>
                        {/* Personal Information */}
                        <div className="personal-info">
                            {profile.PhotoUrl ? (
                                <img
                                    className="profile-photo"
                                    src={`${serverUrl}${profile.PhotoUrl}`}
                                    alt={`${personalInfo?.FirstName ?? ''} ${personalInfo?.LastName ?? ''}`}
                                />
                            ) : (
                                <div className="my-profile-avatar">
                                    {personalInfo?.FirstName?.charAt(0) ?? ''}
                                    {personalInfo?.LastName?.charAt(0) ?? ''}
                                </div>
                            )}

                            <div className="profile-personal-info">
                                <h2>
                                    {personalInfo?.FirstName} {personalInfo?.LastName}
                                </h2>
                                <p>{personalInfo?.Profession}</p>
                            </div>
                        </div>

                        <div>
                            {/* Career Information */}
                            {summary?.CareerSummary && (
                                <section>
                                    <h2>Career Summary</h2>
                                    <p>{summary.CareerSummary}</p>
                                </section>
                            )}

                            {summary?.CareerGoals && (
                                <section>
                                    <hr className="profile-divider" />
                                    <h2>Career Goals</h2>
                                    <p>{summary.CareerGoals}</p>
                                </section>
                            )}
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
                            <div className="profile-edit-button">
                                <IconButton
                                    icon="edit"
                                    onClick={() => {
                                        setEditSection('Contact');
                                        setEditData(contact);
                                        setIsEditModalOpen(true);
                                    }}
                                />
                            </div>

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
                        {Array.isArray(profile.Languages) && (
                            <section>
                                <div className="profile-edit-button">
                                    <IconButton
                                        icon="edit"
                                        onClick={() => {
                                            setEditSection('Languages');
                                            setEditData(profile.Languages);
                                            setIsEditModalOpen(true);
                                        }}
                                    />
                                </div>

                                <hr className="profile-divider" />
                                <h2>Languages</h2>

                                {profile.Languages.map(lang => (
                                    <ul className="respon" key={lang.Id}>
                                        <li>
                                            {lang.Name} - {lang.Levels}
                                        </li>
                                    </ul>
                                ))}
                            </section>
                        )}

                        {/* Skills */}
                        {Array.isArray(profile.Skills) && (
                            <section>
                                <div className="profile-edit-button">
                                    <IconButton
                                        icon="edit"
                                        onClick={() => {
                                            setEditSection('Skills');
                                            setEditData(profile.Skills);
                                            setIsEditModalOpen(true);
                                        }}
                                    />
                                </div>

                                <hr className="profile-divider" />
                                <h2>Skills</h2>

                                {profile.Skills.map(pro => (
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
                        {Array.isArray(profile.References) && (
                            <section>
                                <div className="profile-edit-button">
                                    <IconButton
                                        icon="edit"
                                        onClick={() => {
                                            setEditSection('References');
                                            setEditData(profile.References);
                                            setIsEditModalOpen(true);
                                        }}
                                    />
                                </div>
                                <hr className="profile-divider" />
                                <h2>References</h2>

                                {profile.References.map(myRef => (
                                    <div className="profile-item" key={myRef.Id}>
                                        <h3>{myRef.Name}</h3>
                                        <p>{myRef.Position}</p>
                                        <p>{myRef.Contact}</p>
                                    </div>
                                ))}
                            </section>
                        )}

                        {/* Hobbies */}
                        {Array.isArray(profile.Hobbies) && (
                            <section>
                                <div className="profile-edit-button">
                                    <IconButton
                                        icon="edit"
                                        onClick={() => {
                                            setEditSection('Hobbies');
                                            setEditData(profile.Hobbies);
                                            setIsEditModalOpen(true);
                                        }}
                                    />
                                </div>

                                <hr className="profile-divider" />
                                <h2>Hobbies</h2>

                                <div className="skill-list">
                                    {profile.Hobbies.map(hobby => (
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
                        {Array.isArray(profile.Educations) && (
                            <section>
                                <div className="profile-edit-button">
                                    <IconButton
                                        icon="edit"
                                        onClick={() => {
                                            setEditSection('Educations');
                                            setEditData(profile.Educations);
                                            setIsEditModalOpen(true);
                                        }}
                                    />
                                </div>

                                <h2>Educations</h2>

                                {profile.Educations.map(education => (
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
                        {Array.isArray(profile.WorkExperiences) && (
                            <section>
                                <div className="profile-edit-button">
                                    <IconButton
                                        icon="edit"
                                        onClick={() => {
                                            setEditSection('WorkExperiences');
                                            setEditData(profile.WorkExperiences);
                                            setIsEditModalOpen(true);
                                        }}
                                    />
                                </div>

                                <hr className="profile-divider" />
                                <h2>Work Experience</h2>

                                {profile.WorkExperiences.map(exp => (
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
                        {Array.isArray(profile.Projects) && (
                            <section>
                                <div className="profile-edit-button">
                                    <IconButton
                                        icon="edit"
                                        onClick={() => {
                                            setEditSection('Projects');
                                            setEditData(profile.Projects);
                                            setIsEditModalOpen(true);
                                        }}
                                    />
                                </div>
                                <hr className="profile-divider" />
                                <h2>Projects</h2>

                                {profile.Projects.map(pro => (
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
                        {Array.isArray(profile.Certifications) && (
                            <section>
                                <div className="profile-edit-button">
                                    <IconButton
                                        icon="edit"
                                        onClick={() => {
                                            setEditSection('Certifications');
                                            setEditData(profile.Certifications);
                                            setIsEditModalOpen(true);
                                        }}
                                    />
                                </div>

                                <hr className="profile-divider" />
                                <h2>Certifications</h2>

                                {profile.Certifications.map(certf => (
                                    <div className="profile-item" key={certf.Id}>
                                        <h3>{certf.Title}</h3>
                                        <p>{certf.Issuer}</p>
                                        <span>{formatDate(certf.Date)}</span>
                                    </div>
                                ))}
                            </section>
                        )}

                        {/* Awards */}
                        {Array.isArray(profile.Awards) && (
                            <section>
                                <div className="profile-edit-button">
                                    <IconButton
                                        icon="edit"
                                        onClick={() => {
                                            setEditSection('Awards');
                                            setEditData(profile.Awards);
                                            setIsEditModalOpen(true);
                                        }}
                                    />
                                </div>

                                <hr className="profile-divider" />
                                <h2>Awards</h2>

                                {profile.Awards.map(award => (
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
            </main>
        </div>
    );

};

export default MyProfile;
