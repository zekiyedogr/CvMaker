import { useRoute } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Image,
} from 'react-native';

import { launchImageLibrary, type Asset } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Feather';

import MessageModal from '../../../components/MessageModal/MessageModal';
import BaseButton from '../../../components/BaseButton/BaseButton';
import TextInput from '../../../components/TextInput/TextInput';

import EditContact, { ContactInformation } from '../../../components/EditContact/EditContact';
import EditEducations, { Education} from '../../../components/EditEducations/EditEducations';
import EditWorkExperiences, { WorkExperience } from '../../../components/EditWorkExperiences/EditWorkExperiences';
import EditProjects, { Project } from '../../../components/EditProjects/EditProjects';
import EditSkills, {Skill} from '../../../components/EditSkills/EditSkills';
import EditLanguages, { Language } from '../../../components/EditLanguages/EditLanguages';
import EditDocuments, {Document} from '../../../components/EditDocuments/EditDocuments';
import EditHobbies, { Hobby } from '../../../components/EditHobbies/EditHobbies';
import EditReferences, { Reference } from '../../../components/EditReferences/EditReferences';

import colors from '../../../constants/colors';
import styles from './EditProfile.styles';
import api from '../../../services/api';

export interface Profile {
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

    Contact: ContactInformation | null;

    Educations: Education[];

    WorkExperiences: WorkExperience[];

    Projects: Project[];

    Skills: Skill[];

    Languages: Language[]

    Certifications: Document[];

    Awards: Document[];

    Hobbies: Hobby[];

    References: Reference[];
}

const EditProfile = ({ navigation }: any) => {
    const route = useRoute<any>();
    const profileId = route.params?.profileId;

    const [step, setStep] = useState(1);
    const [isSaving, setIsSaving] = useState(false);
    const [photoAsset, setPhotoAsset] = useState<Asset | null>(null);
    const [modalType, setModalType] = useState<'message' | 'error' | 'confirm'>('message');
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const totalSteps = 13;

    const [profile, setProfile] = useState<Profile>({
        Id: 0,
        UserId: 0,
        Name: '',
        PhotoUrl: null,

        PersonalInformation: {
            FirstName: '',
            LastName: '',
            Profession: '',
        },

        Summary: {
            CareerSummary: '',
            CareerGoals: '',
        },

        Contact: {
            Email: null,
            Phone: null,
            Location: null,
            LinkedIn: null,
            GitHub: null,
            Portfolio: null,
            X: null,
            Medium: null,
            DevTo: null,
            Hashnode: null,
            Dribbble: null,
            Behance: null,
            StackOverflow: null,
            Skype: null,
            Zoom: null,
            Discord: null,
        },

        Educations: [],
        WorkExperiences: [],
        Projects: [],
        Skills: [],
        Languages: [],
        Certifications: [],
        Awards: [],
        Hobbies: [],
        References: [],
    });

    useEffect(() => {
        const fetchProfile = async () => {
            if (!profileId) {
                showMessage('Error', 'Profile ID not found.', 'error');
                return;
            }

            try {
                setLoading(true);

                const response = await api.get(`/profiles/${profileId}`);

                setProfile(response.data.data);
            } catch (error: any) {
                console.error(
                    'Profile could not be loaded:',
                    error.response?.data ?? error,
                );

                showMessage(
                    'Error',
                    error.response?.data?.message ??
                        'Profile could not be loaded.',
                    'error',
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [profileId]);


    const goToBack = () => {
        if (step === 1) {
            navigation.goBack();
        } else {
            setStep(prev => prev - 1);
        }
    };

    const showMessage = (
        title: string,
        message: string,
        type: 'message' | 'error' = 'message',
    ) => {
        setModalType(type);
        setModalTitle(title);
        setModalMessage(message);
        setModalVisible(true);
    };

    const handleUpdateProfile = async () => {
        if (isSaving || loading) return;

        console.log(profile)

        if (!profile.Name.trim()) {
            showMessage(
                'Warning',
                'Please enter a profile name.',
                'error',
            );
            return;
        }

        try {
            setIsSaving(true);

            await api.patch(`/profiles/${profileId}`, {
                Name: profile.Name.trim(),
                PersonalInformation: profile.PersonalInformation,
                Summary: profile.Summary,
                PhotoUrl: photoAsset ? null : profile.PhotoUrl,
            });

            await api.patch(`/profiles/${profileId}/contact`, {Contact: profile.Contact});

            await api.patch( `/profiles/${profileId}/educations`, profile.Educations)

            await api.patch(`/profiles/${profileId}/work-experiences`, profile.WorkExperiences);

            await api.patch(`/profiles/${profileId}/projects`, profile.Projects);

            await api.patch(`/profiles/${profileId}/skills`, profile.Skills);

            await api.patch(`/profiles/${profileId}/languages`, profile.Languages);

            await api.patch(`/profiles/${profileId}/certifications`, profile.Certifications);

            await api.patch(`/profiles/${profileId}/awards`, profile.Awards);

            await api.patch(`/profiles/${profileId}/hobbies`, profile.Hobbies);

            await api.patch(`/profiles/${profileId}/references`, profile.References);

            // 12. Yeni fotoğraf seçildiyse yükle
            if (photoAsset?.uri) {
                const formData = new FormData();

                formData.append('photo', {
                    uri: photoAsset.uri,
                    type: photoAsset.type ?? 'image/jpeg',
                    name: photoAsset.fileName ?? 'profile.jpg',
                } as any);

                await api.post(
                    `/profiles/${profileId}/photo`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    },
                );
            }

            showMessage(
                'Success',
                'Profile updated successfully!',
            );

        } catch (error: any) {
            console.error(
                'Profile update error:',
                error.response?.data ?? error,
            );

            showMessage(
                'Error',
                error.response?.data?.message ??
                    'An error occurred while updating the profile.',
                'error',
            );
        } finally {
            setIsSaving(false);
        }
    };

    const goToNext = () => {
        if (isSaving) return;

        if (step < totalSteps) {
            setStep(prev => prev + 1);
        } else {
            handleUpdateProfile();
        }
    };

    const selectPhoto = async () => {
        try {
            const result = await launchImageLibrary({
                mediaType: 'photo',
                selectionLimit: 1,
            });

            if (result.didCancel || result.errorCode) return;

            const asset = result.assets?.[0];

            if (asset?.uri) {
                setPhotoAsset(asset);

                setProfile(prev => ({
                    ...prev,
                    PhotoUrl: asset.uri!,
                }));
            }
            } catch (error) {
                console.error('Photo selection error:', error);

                showMessage(
                    'Error',
                    'Photo selection error.',
                    'error',
                );
            }
    };

    const updatePersonalInformation = (
        field: 'FirstName' | 'LastName' | 'Profession',
        value: string,
    ) => {
        setProfile(prev => ({
            ...prev,
            PersonalInformation: {
                ...prev.PersonalInformation!,
                [field]: value,
            },
        }));
    };    

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={goToBack}
                >
                    <Icon
                        name="arrow-left"
                        size={26}
                        color={colors.black}
                    />
                </TouchableOpacity>

                <Text style={styles.headerText}>
                    {profile.Name}
                </Text>

                <Text style={styles.step}>
                    {step} of {totalSteps}
                </Text>
            </View>

            {/* Form Content */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* STEP 1 - Personal Information */}
                {step === 1 && (
                    <>
                        <Text style={styles.sectionTitle}>
                            Personal Information
                        </Text>

                        <TouchableOpacity
                            style={styles.photoContainer}
                            onPress={selectPhoto}
                            activeOpacity={0.7}
                        >
                            {profile.PhotoUrl ? (
                                <Image
                                    source={{ uri: profile.PhotoUrl }}
                                    style={styles.profilePhoto}
                                />
                            ) : (
                                <View style={styles.photoPlaceholder}>
                                    <Icon
                                        name="camera"
                                        size={28}
                                        color={colors.gray}
                                    />
                                    <Text style={styles.photoText}>
                                        Add Photo
                                    </Text>
                                </View>
                            )}
                        </TouchableOpacity>

                        <TextInput
                            label="First Name"
                            name="FirstName"
                            value={profile.PersonalInformation?.FirstName || ''}
                            onChange={value =>
                                updatePersonalInformation('FirstName', value)
                            }
                            placeholder="First Name"
                            type="text"
                            required
                        />

                        <TextInput
                            label="Last Name"
                            name="LastName"
                            value={profile.PersonalInformation?.LastName || ''}
                            onChange={value =>
                                updatePersonalInformation('LastName', value)
                            }
                            placeholder="Last Name"
                            type="text"
                            required
                        />

                        <TextInput
                            label="Profession"
                            name="Profession"
                            value={profile.PersonalInformation?.Profession || ''}
                            onChange={value =>
                                updatePersonalInformation('Profession', value)
                            }
                            placeholder="Profession"
                            type="text"
                            required
                        />
                    </>
                )}

                {/* STEP 2 - Summary*/}
                {step === 2 && (
                    <>
                        <Text style={styles.sectionTitle}>
                            Career Summary
                        </Text>

                        <TextInput
                            label="Career Summary"
                            name="CareerSummary"
                            value={profile.Summary?.CareerSummary || ''}
                            onChange={value =>
                                setProfile(prev => ({
                                    ...prev,
                                    Summary: {
                                        ...prev.Summary!,
                                        CareerSummary: value,
                                    },
                                }))
                            }
                            placeholder="Write a short summary about yourself"
                            type="text"
                        />

                        <Text style={styles.sectionTitle}>
                            Career Goals
                        </Text>
                        <TextInput
                            label="Career Goals"
                            name="CareerGoals"
                            value={profile.Summary?.CareerGoals || ''}
                            onChange={value =>
                                setProfile(prev => ({
                                    ...prev,
                                    Summary: {
                                        ...prev.Summary!,
                                        CareerGoals: value,
                                    },
                                }))
                            }
                            placeholder="Describe your career goals"
                            type="text"
                        />
                    </>
                )}

                {/* STEP 3 - Contact Information */}
                {step === 3 && (
                    <>
                        <Text style={styles.sectionTitle}>
                            Contact Information
                        </Text>

                        <EditContact
                            data={profile.Contact}
                            onChange={updatedData =>
                                setProfile(prev => ({
                                    ...prev,
                                    Contact: {
                                        ...prev.Contact!,
                                        ...updatedData,
                                    },
                                }))
                            }
                        />
                    </>
                )}

                {/* STEP 4 - Educations */}
                {step === 4 && (
                    <>
                        <Text style={styles.sectionTitle}>Education</Text>

                        <EditEducations
                            data={profile.Educations}
                            onChange={updatedEducations =>
                                setProfile(prev => ({
                                    ...prev,
                                    Educations: updatedEducations,
                                }))
                            }
                        />
                    </>
                )}

                {/* STEP 5 - Work Experiences */}
                {step === 5 && (
                    <>
                        <Text style={styles.sectionTitle}>Work Experiences</Text>

                        <EditWorkExperiences
                            data={profile.WorkExperiences}
                            onChange={updatedData =>
                                setProfile(prev => ({
                                    ...prev,
                                    WorkExperiences: updatedData,
                                }))
                            }
                        />
                    </>
                )}

                {/* STEP 6 - Projects */}
                {step === 6 && (
                    <>
                        <Text style={styles.sectionTitle}>Projects</Text>

                        <EditProjects
                            data={profile.Projects}
                            onChange={updatedData =>
                                setProfile(prev => ({
                                    ...prev,
                                    Projects: updatedData,
                                }))
                            }
                        />
                    </>
                )}

                {/* STEP 7 - Skills */}
                {step === 7 && (
                    <>
                        <Text style={styles.sectionTitle}>Skills</Text>

                        <EditSkills
                            data={profile.Skills}
                            onChange={updatedData =>
                                setProfile(prev => ({
                                    ...prev,
                                    Skills: updatedData,
                                }))
                            }
                        />
                    </>
                )}

                {/* STEP 8 - Languages */}
                {step === 8 && (
                    <>
                        <Text style={styles.sectionTitle}>Languages</Text>

                        <EditLanguages
                            data={profile.Languages}
                            onChange={(languages) =>
                                setProfile(prev => ({
                                    ...prev,
                                    Languages: languages,
                                }))
                            }
                        />
                    </>
                )}

                {/* STEP 9 - Certifications */}
                {step === 9 && (
                    <>
                        <Text style={styles.sectionTitle}>Certifications</Text>
                        <EditDocuments
                            data={profile.Certifications}
                            onChange={(documents) =>
                                setProfile(prev => ({
                                    ...prev,
                                    Certifications: documents,
                                }))
                            }
                            type="certifications"
                        />
                    </>
                )}

                {/* STEP 10 - Awards */}
                {step === 10 && (
                    <>
                        <Text style={styles.sectionTitle}>Awards</Text>
                        <EditDocuments
                            data={profile.Awards}
                            onChange={(documents) =>
                                setProfile(prev => ({
                                    ...prev,
                                    Awards: documents,
                                }))
                            }
                            type="awards"
                        />
                    </>
                )}

                {/* STEP 11 - Hobbies */}
                {step === 11 && (
                    <>
                        <Text style={styles.sectionTitle}>Hobbies</Text>
                        <EditHobbies
                            data={profile.Hobbies}
                            onChange={(hobbies) =>
                                setProfile(prev => ({
                                    ...prev,
                                    Hobbies: hobbies,
                                }))
                            }
                        />
                    </>
                )}

                {/* STEP 12 - References */}
                {step === 12 && (
                    <>
                        <Text style={styles.sectionTitle}>References</Text>

                        <EditReferences
                            data={profile.References}
                            onChange={(references) =>
                                setProfile(prev => ({
                                    ...prev,
                                    References: references,
                                }))
                            }
                        />
                    </>
                )}

                {/* STEP 13 - Profile Name */}
                {step === 13 && (
                    <>
                        <Text style={styles.sectionTitle}>
                            Profile Name
                        </Text>

                        <TextInput
                            label="Profile Name"
                            name="Name"
                            value={profile.Name}
                            onChange={value =>
                                setProfile(prev => ({
                                    ...prev,
                                    Name: value,
                                }))
                            }
                            placeholder="Enter profile name"
                            type="text"
                            required
                        />
                    </>
                )}
            </ScrollView>

            {/* Navigation Button */}
            <View style={styles.buttonContainer}>
                <BaseButton
                    title={ isSaving ? 'Saving...' : step === totalSteps ?
                        'Save Changes' : 'Next'
                    }
                    onPress={goToNext}
                />
            </View>

            <MessageModal
                visible={modalVisible}
                type={modalType}
                title={modalTitle}
                message={modalMessage}
                onClose={() => {
                    setModalVisible(false);

                    if (modalTitle === 'Success') {
                        navigation.goBack();
                    }
                }}
            />
        </View>
    );
};

export default EditProfile;
