import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import api from '../../../services/api';

import CvList from '../../../features/data/CvList';
import fontFamilyList from '../../../features/data/fontFamilyList';

import createContentProfile from '../../../features/data/createContentProfile';

import SectionModal from '../../../components/SectionModal/SectionModal';
import MessageModal from '../../../components/MessageModal/MessageModal';
import IconButton from '../../../components/IconButton/IconButton';
import BaseButton from '../../../components/BaseButton/BaseButton';
import TextInput from '../../../components/TextInput/TextInput';
import Loading from '../../../components/Loading/Loading';
import Dropdown from '../../../components/Dropdown/Dropdown';

import './CreateCv.css';

interface Profile {
    Id: number;
    Name: string;
}

const CreateCv = () => {
    const { profileId } = useParams();
    const navigate = useNavigate();
    const cvPreviewRef = useRef<HTMLDivElement>(null);

    const [profile, setProfile] = useState<Profile | null>(null);
    const [contentProfile, setContentProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(true);
    const [sectionModal, setSectionModal] = useState({ isOpen: false, title: ''});
    const [isPdfLoading, setIsPdfLoading] = useState(false);

    const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(0);

    const selectedTemplate = CvList[selectedTemplateIndex];
    const SelectedComponent = selectedTemplate.component;

    const [modalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState<'message' | 'error' | 'confirm'>('message');
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');

    const showMessage = (
        title: string,
        message: string,
        type: 'message' | 'error' | 'confirm' = 'message'
    ) => {
        setModalTitle(title);
        setModalMessage(message);
        setModalType(type);
        setModalVisible(true);
    };

    useEffect(() => {
        const getProfile = async () => {
            try {
                const response = await api.get(`/profiles/${profileId}`);
                const profileData = response.data.data;

                setProfile(profileData);

                const newContentProfile = createContentProfile({
                    profile: profileData,
                    template: CvList[0],
                });
                setContentProfile(newContentProfile);

            } catch (error) {
                console.error('Profile could not be fetched:', error);
            } finally {
                setLoading(false);
            }
        };

        if (profileId) {
            getProfile();
        }
    }, [profileId]);

    // Template değiştirme
    const handlePreviousTemplate = () => {
        if (!profile) return;

        const newIndex =
            (selectedTemplateIndex - 1 + CvList.length) % CvList.length;

        setSelectedTemplateIndex(newIndex);

        setContentProfile(
            createContentProfile({
                profile,
                template: CvList[newIndex],
            })
        );
    };

    const handleNextTemplate = () => {
        if (!profile) return;

        const newIndex = (selectedTemplateIndex + 1) % CvList.length;

        setSelectedTemplateIndex(newIndex);

        setContentProfile(
            createContentProfile({
                profile,
                template: CvList[newIndex],
            })
        );
    };
    // COLOR CHANGE
    const handleThemeChange = (index: number) => {
        const selectedTheme = selectedTemplate.themes[index];

        setContentProfile((prev: any) => ({
            ...prev,
            theme: selectedTheme,
            colorPaletteId: selectedTheme.id,
        }));
    };

    // FONT CHANGE
    const handleHeadingChange = (fontId: number) => {
        setContentProfile((prev: any) => ({
            ...prev,
            heading: fontFamilyList[fontId],
        }));
    };

    const handleBodyChange = (fontId: number) => {
        setContentProfile((prev: any) => ({
            ...prev,
            body: fontFamilyList[fontId],
        }));
    };

    // FONT-SİZE CHANGE
    const handleSizeChange = (value: number) => {
        setContentProfile((prev: any) => ({
            ...prev,
            sizeValue: value,
            sizes: selectedTemplate.sizes(value),
        }));
    };

    const captureCvThumbnail = async (): Promise<Blob> => {
        // Düzenleme butonlarını gizle
        if (isEditing) {
            setIsEditing(false);

            await new Promise<void>(resolve => {
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => resolve());
                });
            });
        }

        // Fontların yüklenmesini bekle
        await document.fonts.ready;

        const originalElement = cvPreviewRef.current?.querySelector(
            '.classic-cv'
        ) as HTMLElement | null;

        if (!originalElement) {
            throw new Error('CV element not found.');
        }

        // CV'nin kopyasını oluştur
        const clone = originalElement.cloneNode(true) as HTMLElement;

        // Bağımsız bir kapsayıcı oluştur
        const wrapper = document.createElement('div');

        wrapper.style.position = 'absolute';
        wrapper.style.left = '0';
        wrapper.style.top = '0';
        wrapper.style.width = '794px';
        wrapper.style.zIndex = '999999';
        wrapper.style.pointerEvents = 'none';
        wrapper.style.backgroundColor = '#ffffff';

        // CV boyutlarını sabitle
        clone.style.width = '794px';
        clone.style.minWidth = '794px';
        clone.style.height = 'auto';
        clone.style.minHeight = '1123px';
        clone.style.overflow = 'visible';
        clone.style.flexShrink = '0';
        clone.style.transform = 'none';

        wrapper.appendChild(clone);
        document.body.appendChild(wrapper);

        try {

            // Görsellerin yüklenmesini bekle
            const images = Array.from(clone.querySelectorAll('img'));

            await Promise.all(
                images.map(img => {
                    if (img.complete) {
                        return Promise.resolve();
                    }

                    return new Promise<void>(resolve => {
                        img.onload = () => resolve();
                        img.onerror = () => resolve();
                    });
                })
            );

            const width = 794;
            const height = Math.max(1123, clone.scrollHeight);

            const canvas = await html2canvas(clone, {
                scale: 2,
                width,
                height,
                windowWidth: width,
                windowHeight: height,
                scrollX: 0,
                scrollY: 0,
                backgroundColor: '#ffffff',
                useCORS: true
            });
            
            return await new Promise<Blob>((resolve, reject) => {
                canvas.toBlob(blob => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error('Thumbnail could not be created.'));
                    }
                }, 'image/png');
            });

        } finally {
            wrapper.remove();
        }
    };

    const handleCv = async () => {
        try {
            const thumbnail = await captureCvThumbnail();
            // İçerik kontrolü
            const hasContent = (value: any): boolean => {
                if (value === null || value === undefined) return false;

                if (typeof value === 'string') {
                    return value.trim().length > 0;
                }

                if (typeof value === 'number') {
                    return true;
                }

                if (Array.isArray(value)) {
                    return value.some(item => hasContent(item));
                }

                if (typeof value === 'object') {
                    return Object.entries(value).some(([key, item]) => {
                        if ([
                            'Id',
                            'id',
                            'ProfileId',
                            'visibility',
                            'Visibility',
                            'CreatedAt',
                            'UpdatedAt',
                        ].includes(key)) {
                            return false;
                        }

                        return hasContent(item);
                    });
                }

                return false;
            };

            // İçerik varsa ve kullanıcının görünürlük tercihi açıksa true
            const getVisibility = (visibility: boolean, content: any) => {
                return Boolean(visibility && hasContent(content));
            };

            // CONTACT DATA
            // Alan isimleri backend SQL kolonlarıyla eşleşmeli.
            const contactFieldMap: Record<string, string> = {
                email: 'Email',
                phone: 'Phone',
                location: 'Location',
                linkedin: 'LinkedIn',
                github: 'GitHub',
                portfolio: 'Portfolio',
                x: 'X',
                medium: 'Medium',
                devto: 'DevTo',
                hashnode: 'Hashnode',
                dribbble: 'Dribbble',
                behance: 'Behance',
                stackoverflow: 'StackOverflow',
                skype: 'Skype',
                zoom: 'Zoom',
                discord: 'Discord',
            };

            const CvContactsData = Object.fromEntries(
                contentProfile.contact.content.map((item: any) => [
                    contactFieldMap[item.field],
                    Boolean(item.visibility),
                ])
            );

            // Backend bütün kolonları beklediği için eksik alanları da ekliyoruz.
            Object.values(contactFieldMap).forEach(field => {
                if (!(field in CvContactsData)) {
                    CvContactsData[field] = '';
                }
            });

            const contactVisibility =
                contentProfile.contact.visibility &&
                contentProfile.contact.content.some(
                    (item: any) =>
                        getVisibility(item.visibility, item.value)
                );

            // VISIBILITY DATA
            const CvVisibilitiesData: {
                ContentTypeId: number;
                ContentId: number | null;
                Visibility: boolean;
            }[] = [];

            const addVisibility = (
                ContentTypeId: number,
                ContentId: number | null,
                Visibility: boolean
            ) => {
                CvVisibilitiesData.push({
                    ContentTypeId,
                    ContentId,
                    Visibility: Boolean(Visibility),
                });
            };

            // SUMMARY
            addVisibility(
                1,
                null,
                getVisibility(
                    contentProfile.summary.careerSummary.visibility,
                    contentProfile.summary.careerSummary.text
                )
            );

            addVisibility(
                2,
                null,
                getVisibility(
                    contentProfile.summary.careerGoals.visibility,
                    contentProfile.summary.careerGoals.text
                )
            );

            // PHOTO
            addVisibility(
                16,
                null,
                getVisibility(
                    contentProfile.personalInformation.photo.visibility,
                    contentProfile.personalInformation.photo.value
                )
            );

            // EDUCATIONS
            contentProfile.educations.content.forEach((item: any) => {
                addVisibility(
                    4,
                    item.Id,
                    getVisibility(item.visibility, item)
                );
            });

            // WORK EXPERIENCES
            contentProfile.workExperience.content.forEach((item: any) => {
                addVisibility(
                    6,
                    item.Id,
                    getVisibility(item.visibility, item)
                );

                (item.responsibilities ?? []).forEach((description: any) => {
                    addVisibility(
                        5,
                        description.Id,
                        getVisibility(
                            description.visibility,
                            description.description
                        )
                    );
                });
            });

            // PROJECTS
            contentProfile.projects.content.forEach((item: any) => {
                addVisibility(
                    7,
                    item.Id,
                    getVisibility(item.visibility, item)
                );

                (item.subclause ?? []).forEach((description: any) => {
                    addVisibility(
                        10,
                        description.Id,
                        getVisibility(
                            description.visibility,
                            description.text
                        )
                    );
                });
            });

            // SKILLS
            contentProfile.skills.content.forEach((item: any) => {
                addVisibility(
                    8,
                    item.Id,
                    getVisibility(item.visibility, item)
                );

                (item.items ?? []).forEach((skillItem: any) => {
                    addVisibility(
                        9,
                        skillItem.Id,
                        getVisibility(
                            skillItem.visibility,
                            skillItem
                        )
                    );
                });
            });

            // LANGUAGES
            contentProfile.languages.content.forEach((item: any) => {
                addVisibility(
                    11,
                    item.Id,
                    getVisibility(item.visibility, item)
                );
            });

            // CERTIFICATIONS
            contentProfile.certifications.content.forEach((item: any) => {
                addVisibility(
                    12,
                    item.Id,
                    getVisibility(item.visibility, item)
                );
            });

            // AWARDS
            contentProfile.awards.content.forEach((item: any) => {
                addVisibility(
                    13,
                    item.Id,
                    getVisibility(item.visibility, item)
                );
            });

            // HOBBIES
            contentProfile.hobbies.content.forEach((item: any) => {
                addVisibility(
                    14,
                    item.Id,
                    getVisibility(item.visibility, item)
                );
            });

            // REFERENCES
            contentProfile.references.content.forEach((item: any) => {
                addVisibility(
                    15,
                    item.Id,
                    getVisibility(item.visibility, item)
                );
            });

            // CV DATA
            const getSectionVisibility = (section: any) => {
                return Boolean(
                    section.visibility &&
                    section.content.some(
                        (item: any) =>
                            getVisibility(item.visibility, item)
                    )
                );
            };

            const cvData = {
                ProfileId: contentProfile.profileId,
                CvName: contentProfile.name,

                Contact: Boolean(contactVisibility),
                Educations: getSectionVisibility(contentProfile.educations),
                WorkExperiences: getSectionVisibility(contentProfile.workExperience),
                Projects: getSectionVisibility(contentProfile.projects),
                Skills: getSectionVisibility(contentProfile.skills),
                Languages: getSectionVisibility(contentProfile.languages),
                Certifications: getSectionVisibility(contentProfile.certifications),
                Awards: getSectionVisibility(contentProfile.awards),
                Hobbies: getSectionVisibility(contentProfile.hobbies),
                ReferenceSection: getSectionVisibility(contentProfile.references),

                TemplateId: contentProfile.templateId,
                ColorPaletteId: contentProfile.colorPaletteId,
                sizeValue: contentProfile.sizeValue,
            };

            // Summary zorunluluğu: Backend de aynı kontrolü yapıyor.
            const hasSummary = CvVisibilitiesData.some(
                item =>
                    (item.ContentTypeId === 1 || item.ContentTypeId === 2) &&
                    item.Visibility
            );

            if (!hasSummary) {
                showMessage(
                    'Warning',
                    'Career Summary or Career Goals must be visible.',
                    'error'
                );
                return;
            }

            // FORM DATA
            const formData = new FormData();

            formData.append('thumbnail', thumbnail, 'cv-thumbnail.png');

            // API REQUEST
            formData.append('data', JSON.stringify({
                cvData,
                CvContactsData,
                CvVisibilitiesData
            }));

            // API REQUEST
            const response = await api.post('/cvs', formData);

            console.log('CV saved:', response.data);
            showMessage(
                'Success',
                'CV created successfully.'
            );
            navigate('/cvs');

        } catch (error: any) {
            console.error('CV could not be saved:', error);
            showMessage(
                'Error',
                error.response?.data?.message || 'CV could not be saved.',
                'error'
            );
        }
    };

    const handleDownloadPdf = async () => {
        try {
            setIsPdfLoading(true);

            await selectedTemplate.exportPdf(contentProfile);

        } catch (error) {
            console.error('PDF could not be generated:', error);
            showMessage(
                'Error',
                'PDF could not be generated.',
                'error'
            );
        } finally {
            setIsPdfLoading(false);
        }
    };

    const openSectionModal = (title: string) => {
        setSectionModal({ isOpen: true, title });
    };

    const closeSectionModal = () => {
        setSectionModal({ isOpen: false, title: '', });
    };

    const handleSectionSave = (updatedData: any) => {
        console.log(updatedData)
        setContentProfile((prev: any) => {
            if (sectionModal.title === 'photo') {
                return {
                    ...prev,
                    personalInformation: {
                        ...prev.personalInformation,
                        photo: updatedData,
                    },
                };
            }

            if (sectionModal.title === 'cvSections') {
                return {
                    ...prev,
                    personalInformation: {
                        ...prev.personalInformation,
                        photo: {
                            ...prev.personalInformation.photo,
                            visibility:
                                updatedData.personalInformation.photo.visibility,
                        },
                    },
                    ...Object.fromEntries(
                        [
                            'contact',
                            'educations',
                            'workExperience',
                            'projects',
                            'skills',
                            'languages',
                            'certifications',
                            'awards',
                            'hobbies',
                            'references',
                        ].map(key => [
                            key,
                            {
                                ...prev[key],
                                visibility: updatedData[key].visibility,
                            },
                        ]),
                    ),
                };
            }

            return {
                ...prev,
                [sectionModal.title]: updatedData,
            };
        });
    };

    if (loading) {
        return <p>Loading profile...</p>;
    }

    if (!profile || !contentProfile) {
        return <p>Profile not found.</p>;
    }
    return (
        <div className="create-cv-page">
            {isPdfLoading && <Loading message="PDF is being prepared..." />}
            <SectionModal
                isOpen={sectionModal.isOpen}
                title={sectionModal.title}
                data={
                    sectionModal.title === 'photo'
                        ? contentProfile.personalInformation.photo
                        : sectionModal.title === 'cvSections'
                            ? contentProfile
                            : contentProfile[sectionModal.title]
                }
                onClose={closeSectionModal}
                onSave={handleSectionSave}
            />
            <MessageModal
                visible={modalVisible}
                type={modalType}
                title={modalTitle}
                message={modalMessage}
                onClose={() => {
                    setModalVisible(false);

                    if (modalTitle === 'Success') {
                        navigate('/cvs');
                    }
                }}
            />

            {/* LEFT -> CV */}
            <div className="cv-preview-area" ref={cvPreviewRef}>
                <SelectedComponent
                    contentProfile={{ ...contentProfile, isEditing}}
                    onEditSection={openSectionModal}
                />
            </div>

            {/* RIGHT EDITING */}
            <div className="cv-editor-panel">

                {/* Template*/}
                <div className="template-navigation">
                    <IconButton
                        icon="left"
                        onClick={handlePreviousTemplate}
                    />

                    <span>{selectedTemplate.name}</span>

                    <IconButton
                        icon="right"
                        onClick={handleNextTemplate}
                    />
                </div>
                <div className="editor-actions">
                    <TextInput
                        label="Cv Name"
                        name="cvName"
                        value={contentProfile.name}
                        onChange={(value: string) =>
                            setContentProfile({
                                ...contentProfile,
                                name: value
                            })
                        }
                    />
                </div>

                <div className="editor-actions">
                    <BaseButton title='Edit' onClick={() => setIsEditing(prev => !prev)} />
                    <BaseButton title='Save' onClick={handleCv} />
                    <BaseButton title="PDF" onClick={handleDownloadPdf} />
                    
                </div>

                {/* Font */}
                <div className="editor-section">
                    <h3>Font</h3>
                    <div className='font-container'>
                        <div className='font-container-edit'>
                            <Dropdown
                                label="Heading Font"
                                name="headingFont"
                                value={contentProfile.heading.id}
                                options={fontFamilyList.map(font => ({
                                    label: font.name,
                                    value: font.id
                                }))}
                                onChange={(value) => handleHeadingChange(Number(value))}
                            />
                        </div>
                        <div className='font-container-edit'>
                            <Dropdown
                                label="Body Font"
                                name="bodyFont"
                                value={contentProfile.body.id}
                                options={fontFamilyList.map(font => ({
                                    label: font.name,
                                    value: font.id
                                }))}
                                onChange={(value) => handleBodyChange(Number(value))}
                            />
                        </div>
                    </div>                    
                </div>

                {/* Font boyutu */}
                <div className="editor-section">
                    <h3>Font Size</h3>

                    <input
                        type="range"
                        min="0.5"
                        max="1.5"
                        step="0.05"
                        value={contentProfile.sizeValue}
                        onChange={(e) =>
                            handleSizeChange(Number(e.target.value))
                        }
                    />

                    <span>{contentProfile.sizeValue.toFixed(2)}</span>
                </div>

                {/* Renk paleti */}
                <div className="editor-section">
                    <h3>Color Palette</h3>

                    <div className="color-palettes">
                        {selectedTemplate.themes.map((theme) => (
                            <button
                                key={theme.id}
                                className={`color-palette ${
                                    contentProfile.colorPaletteId === theme.id ? 'active' : ''
                                }`}
                                onClick={() =>
                                    handleThemeChange(
                                        selectedTemplate.themes.findIndex(
                                            item => item.id === theme.id
                                        )
                                    )
                                }
                            >
                                <span style={{ backgroundColor: theme.mainColor }} />
                                <span style={{ backgroundColor: theme.secondColor }} />
                                <span style={{ backgroundColor: theme.white }} />
                            </button>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CreateCv;
