import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StatusBar, TextInput, Pressable } from 'react-native';

import { useRoute } from '@react-navigation/native';
import ViewShot from 'react-native-view-shot';
import api from '../../../services/api';

import CvList from '../../../constants/CvList';
import fontFamilyList from '../../../constants/fontFamilyList';
import createContentProfile from '../../../utils/createContentProfile';

import MessageModal from '../../../components/MessageModal/MessageModal';
import SectionModal from '../../../components/SectionModal/SectionModal';
import BaseButton from '../../../components/BaseButton/BaseButton';
import Dropdown from '../../../components/Dropdown/Dropdown';
import IconButton from '../../../components/IconButton/IconButton';

import styles from './CreateCv.styles';

interface Profile {
    Id: number;
    Name: string;
}

const CreateCv = () => {
    const route = useRoute<any>();
    const profileId = route.params?.profileId;

    const [fontMenu, setFontMenu] = useState<'heading' | 'body' | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    
    const cvPreviewRef = useRef<any>(null);

    const [profile, setProfile] = useState<Profile | null>(null);
    const [contentProfile, setContentProfile] = useState<any>(null);

    const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(0);

    const [sectionModal, setSectionModal] = useState({ isOpen: false, title: ''});
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

    const selectedTemplate = CvList[selectedTemplateIndex];
    const SelectedComponent = selectedTemplate.component;

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
        } else {
            setLoading(false);
        }
    }, [profileId]);

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


    const handleCv = async () => {
        try {
            setIsSaving(true);

            // Düzenleme butonlarını gizle
            const previousEditingState = isEditing;
            setIsEditing(false);

            // Ekranın güncellenmesini bekle
            await new Promise<void>(resolve => {
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => resolve());
                });
            });

            // CV fotoğrafını çek
            if (!cvPreviewRef.current) {
                throw new Error('CV preview bulunamadı.');
            }

            const thumbnailUri = await cvPreviewRef.current.capture();

            console.log('THUMBNAIL URI:', thumbnailUri);

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

            const getVisibility = (visibility: boolean, content: any) => {
                return Boolean(visibility && hasContent(content));
            };

            // CONTACT DATA
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
                        getVisibility(description.visibility, description.text)
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
                        getVisibility(skillItem.visibility, skillItem)
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
                    section.content.some(
                        (item: any) =>
                            getVisibility(item.visibility, item)
                    )
                );
            };

            // CV DATA
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
                setIsEditing(previousEditingState);
                return;
            }

            // FORM DATA
            const formData = new FormData();

            formData.append('thumbnail', {
                uri: thumbnailUri,
                name: 'cv-thumbnail.png',
                type: 'image/png',
            } as any);

            formData.append(
                'data',
                JSON.stringify({
                    cvData,
                    CvContactsData,
                    CvVisibilitiesData,
                })
            );

            

            console.log('CV DATA:', JSON.stringify({
                cvData,
                CvContactsData,
                CvVisibilitiesData,
            }, null, 2));

            // API REQUEST
            const response = await api.post('/cvs', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('CV saved:', response.data);

            showMessage('Success', 'CV created successfully.');

        } catch (error: any) {
            console.error('CV could not be saved:', error);
            console.log('BACKEND ERROR:', error.response?.data);
            console.log('STATUS:', error.response?.status);

            showMessage(
                'Error',
                error.response?.data?.message || 'CV could not be saved.',
                'error'
            );
        } finally {
            setIsSaving(false);
        }
    };

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
        const selectedFont = fontFamilyList.find(font => font.id === fontId);

        if (!selectedFont) return;

        setContentProfile((prev: any) => ({
            ...prev,
            heading: selectedFont,
        }));

        setFontMenu(null);
    };

    const handleBodyChange = (fontId: number) => {
        const selectedFont = fontFamilyList.find(font => font.id === fontId);

        if (!selectedFont) return;

        setContentProfile((prev: any) => ({
            ...prev,
            body: selectedFont,
        }));

        setFontMenu(null);
    };

    // FONT-SİZE CHANGE
    const handleSizeChange = (value: number) => {
        setContentProfile((prev: any) => ({
            ...prev,
            sizeValue: value,
            sizes: selectedTemplate.sizes(value),
        }));
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
                <Text style={styles.loadingText}>Loading CV...</Text>
            </View>
        );
    }

    if (!profile || !contentProfile) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>
                    Profile could not be loaded.
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            <ScrollView showsVerticalScrollIndicator={false}>
                <MessageModal
                    visible={modalVisible}
                    type={modalType}
                    title={modalTitle}
                    message={modalMessage}
                    onClose={() => setModalVisible(false)}
                />

                {/* CV PREVIEW */}
                    <ViewShot
                        ref={cvPreviewRef}
                        style={styles.previewContainer}
                        options={{
                            format: 'png',
                            quality: 1,
                            result: 'tmpfile',
                        }}
                    >
                    <SelectedComponent
                        contentProfile={{
                            ...contentProfile,
                            isEditing,
                        }}
                        onEditSection={openSectionModal}
                    />
                </ViewShot>

                {/* EDITOR PANEL */}
                <View style={styles.editorPanel}>

                    {/* TEMPLATE NAVIGATION */}
                    <View style={styles.templateNavigation}>
                        <IconButton
                            icon="left"
                            onPress={handlePreviousTemplate}
                        />
                        <Text style={styles.templateName}>
                            {selectedTemplate.name}
                        </Text>

                        <IconButton
                            icon="right"
                            onPress={handleNextTemplate}
                        />
                    </View>

                    {/* CV NAME */}
                    <View style={styles.editorSection}>
                        <Text style={styles.editorTitle}>CV Name</Text>

                        <TextInput
                            style={styles.textInput}
                            value={contentProfile.name}
                            onChangeText={(value: string) =>
                            setContentProfile({
                                ...contentProfile,
                                name: value
                            })}
                            placeholder="CV Name"
                        />
                    </View>

                    {/* EDIT ACTION */}
                    <View style={styles.editorActions}>
                        <View style={styles.actionButtonContainer}>
                            <BaseButton title="Edit" onPress={() => setIsEditing(prev => !prev)} />
                        </View>

                        <View style={styles.actionButtonContainer}>
                            <BaseButton title={isSaving ? 'Saving...' : 'Save'} onPress={handleCv} />
                        </View>

                        <View style={styles.actionButtonContainer}>
                            <BaseButton title="PDF" onPress={() => {}} />
                        </View>
                    </View>

                    {/* FONT */}
                    <View style={styles.editorSection}>
                        <Text style={styles.editorTitle}>Font</Text>

                        <Dropdown
                            label="Heading Font"
                            name="headingFont"
                            value={contentProfile.heading.id}
                            options={fontFamilyList.map(font => ({
                                label: font.name,
                                value: font.id,
                            }))}
                            onChange={(value) => handleHeadingChange(Number(value))}
                        />

                        <Dropdown
                            label="Body Font"
                            name="bodyFont"
                            value={contentProfile.body.id}
                            options={fontFamilyList.map(font => ({
                                label: font.name,
                                value: font.id,
                            }))}
                            onChange={(value) => handleBodyChange(Number(value))}
                        />
                    </View>

                    {/* FONT SIZE */}
                    <View style={styles.editorSection}>
                        <Text style={styles.editorTitle}>Font Size</Text>

                        <View style={styles.sizeControls}>
                            <IconButton
                                icon="minus"
                                onPress={() => handleSizeChange(
                                    Math.max(0.5, contentProfile.sizeValue - 0.05)
                                )}
                            />
                            <Text style={styles.sizeValue}>
                                {contentProfile.sizeValue.toFixed(2)}
                            </Text>
                            <IconButton
                                icon="plus"
                                onPress={() => handleSizeChange(
                                    Math.min(1.5, contentProfile.sizeValue + 0.05)
                                )}
                            />
                        </View>
                    </View>

                    {/* COLOR PALETTE */}
                    <View style={styles.editorSection}>
                        <Text style={styles.editorTitle}>Color Palette</Text>

                        <View style={styles.colorPalettes}>
                            {selectedTemplate.themes.map((theme: any, index: number) => (
                                <Pressable
                                    key={theme.id}
                                    style={[
                                        styles.colorPalette,
                                        contentProfile.colorPaletteId === theme.id &&
                                            styles.selectedColorPalette,
                                    ]}
                                    onPress={() => handleThemeChange(index)}
                                >
                                    <View
                                        style={[
                                            styles.colorItem,
                                            { backgroundColor: theme.mainColor },
                                        ]}
                                    />
                                    <View
                                        style={[
                                            styles.colorItem,
                                            { backgroundColor: theme.secondColor },
                                        ]}
                                    />
                                    <View
                                        style={[
                                            styles.colorItem,
                                            { backgroundColor: theme.white },
                                        ]}
                                    />
                                </Pressable>
                            ))}
                        </View>
                    </View>

                </View>
            </ScrollView>

            {/* SECTION MODAL */}
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
        </View>
    );
};

export default CreateCv;
