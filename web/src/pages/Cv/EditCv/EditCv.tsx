import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import api from '../../../services/api';

import CvList from '../../../features/data/CvList';
import fontFamilyList from '../../../features/data/fontFamilyList';
import loadContentProfile from '../../../features/data/loadContentProfile';

import SectionModal from '../../../components/SectionModal/SectionModal';
import BaseButton from '../../../components/BaseButton/BaseButton';
import TextInput from '../../../components/TextInput/TextInput';
import Dropdown from '../../../components/Dropdown/Dropdown';
import Loading from '../../../components/Loading/Loading';

import './EditCv.css';

const EditCv = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const cvPreviewRef = useRef<HTMLDivElement>(null);

    const [contentProfile, setContentProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(true);

    const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(0);
    const selectedTemplate = CvList[selectedTemplateIndex];
    const [isPdfLoading, setIsPdfLoading] = useState(false);

    const SelectedComponent = selectedTemplate.component;
    
    const [sectionModal, setSectionModal] = useState({ isOpen: false, title: '',});

    // CV VERİLERİNİ YÜKLE
    useEffect(() => {
        const getCv = async () => {
            try {
                const response = await api.get(`/cvs/${id}`);

                const cv = response.data.data;

                const templateIndex = CvList.findIndex(
                    item => item.templateId === cv.TemplateId
                );

                if (templateIndex === -1) {
                    throw new Error('CV template not found.');
                }

                const template = CvList[templateIndex];

                const loadedProfile = loadContentProfile({
                    cv,
                    template,
                });

                const sizeValue = Number(cv.sizeValue);
                setSelectedTemplateIndex(templateIndex);
                setContentProfile(loadedProfile);

                setContentProfile({
                    ...loadedProfile,
                    sizeValue,
                    sizes: template.sizes(sizeValue),
                });


            } catch (error) {
                console.error('CV could not be loaded:', error);
            } finally {
                setLoading(false);
            }
        };

        getCv();
    }, [id]);

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

    // FONT SIZE CHANGE
    const handleSizeChange = (value: number) => {
        setContentProfile((prev: any) => ({
            ...prev,
            sizeValue: value,
            sizes: selectedTemplate.sizes(value),
        }));
    };

    // CV NAME CHANGE
    const handleNameChange = (value: string) => {
        setContentProfile((prev: any) => ({
            ...prev,
            name: value,
        }));
    };

    const openSectionModal = (title: string) => {
        setSectionModal({ isOpen: true, title });
    };

    const closeSectionModal = () => {
        setSectionModal({
            isOpen: false,
            title: '',
        });
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

    // CV SAVE
    const handleEdit = async () => {
        console.log(contentProfile)
        try {
            const thumbnail = await captureCvThumbnail();

            // İçerik kontrolü
            const hasContent = (value: any): boolean => {
                if (value === null || value === undefined) return false;

                if (typeof value === 'string') {
                    return value.trim().length > 0;
                }

                if (typeof value === 'number') return true;

                if (Array.isArray(value)) {
                    return value.some(item => hasContent(item));
                }

                if (typeof value === 'object') {
                    return Object.entries(value).some(([key, item]) => {
                        if ([
                            'Id', 'id', 'ProfileId',
                            'visibility', 'Visibility',
                            'CreatedAt', 'UpdatedAt'
                        ].includes(key)) {
                            return false;
                        }

                        return hasContent(item);
                    });
                }

                return false;
            };

            const getVisibility = (visibility: boolean, content: any) => {
                return Boolean(visibility && hasContent(content));
            };

            // CONTACT
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
                discord: 'Discord'
            };

            const CvContactsData: Record<string, boolean> = {};

            contentProfile.contact.content.forEach((item: any) => {
                const field = contactFieldMap[item.field];

                if (field) {
                    CvContactsData[field] = Boolean(item.visibility);
                }
            });

            Object.values(contactFieldMap).forEach(field => {
                if (!(field in CvContactsData)) {
                    CvContactsData[field] = false;
                }
            });

            const contactVisibility = Boolean(
                contentProfile.contact.visibility &&
                contentProfile.contact.content.some(
                    (item: any) =>
                        getVisibility(item.visibility, item.value)
                )
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
                    Visibility: Boolean(Visibility)
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
                            description.visibility ?? true,
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
                            description.visibility ?? true,
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
                        getVisibility(skillItem.visibility, skillItem.Name)
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

            // SECTION VISIBILITY
            const getSectionVisibility = (section: any) => {
                return Boolean(
                    section.visibility &&
                    section.content?.some((item: any) =>
                        getVisibility(item.visibility, item)
                    )
                );
            };

            // CV DATA
            const cvData = {
                CvName: contentProfile.name,

                Contact: contactVisibility,
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

            // SUMMARY KONTROLÜ
            const hasSummary = CvVisibilitiesData.some(
                item =>
                    (item.ContentTypeId === 1 || item.ContentTypeId === 2) &&
                    item.Visibility
            );

            if (!hasSummary) {
                console.error('CareerSummary or CareerGoals must be visible.');
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
            const response = await api.put(`/cvs/${id}`, formData);

            console.log('CV updated:', response.data);
            navigate('/cvs');

        } catch (error: any) {
            console.error('CV could not be updated:', error);
            console.log('BACKEND ERROR:', error.response?.data);
            console.log('STATUS:', error.response?.status);
        }
    };

    // PDF
    const handleDownloadPdf = async () => {
        try {
            setIsPdfLoading(true);

            await selectedTemplate.exportPdf(contentProfile);

        } catch (error) {
            console.error('PDF oluşturulamadı:', error);
        } finally {
            setIsPdfLoading(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!contentProfile) {
        return <div>CV could not be loaded.</div>;
    }

    return (
        <div className="create-cv-page">

            {isPdfLoading && <Loading message="PDF is being prepared..." />}
            {/* LEFT -> CV */}
            <div className="cv-preview-area" ref={cvPreviewRef}>
                <SelectedComponent
                    contentProfile={{
                        ...contentProfile,
                        isEditing,
                    }}
                    onEditSection={openSectionModal}
                />
            </div>

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

            {/* RIGHT -> EDITING */}
            <div className="cv-editor-panel">

                {/* Template */}
                <div className="template-navigation">

                    <span>{selectedTemplate.name}</span>

                </div>

                {/* CV NAME */}
                <div className="editor-actions">
                    <TextInput
                        label="Cv Name"
                        name="cvName"
                        value={contentProfile.name}
                        onChange={handleNameChange}
                    />
                </div>

                {/* ACTIONS */}
                <div className="editor-actions">
                    <BaseButton title="Edit" onClick={() => setIsEditing(prev => !prev)} />
                    <BaseButton title="Save" onClick={handleEdit} />
                    <BaseButton title="PDF" onClick={handleDownloadPdf} />

                </div>

                {/* FONT */}
                <div className="editor-section">

                    <h3>Font</h3>

                    <div className="font-container">

                        <div className="font-container-edit">
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

                        <div className="font-container-edit">
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

                {/* FONT SIZE */}
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

                {/* COLOR PALETTE */}
                <div className="editor-section">

                    <h3>Color Palette</h3>

                    <div className="color-palettes">

                        {selectedTemplate.themes.map((theme, index) => (

                            <button
                                key={theme.id}
                                className={`color-palette ${
                                    contentProfile.colorPaletteId === theme.id
                                        ? 'active'
                                        : ''
                                }`}
                                onClick={() => handleThemeChange(index)}
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

export default EditCv;
