
import React, { useEffect, useState } from 'react';

import {
    Modal,
    View,
    Text,
    Pressable,
    ScrollView,
} from 'react-native';

import styles from './SectionModal.styles';

interface SectionModalProps {
    isOpen: boolean;
    title: string;
    data: any;
    onClose: () => void;
    onSave: (data: any) => void;
}

const SectionModal = ({
    isOpen,
    title,
    data,
    onClose,
    onSave,
}: SectionModalProps) => {

    const [localData, setLocalData] = useState<any>(data);

    useEffect(() => {
        if (isOpen) {
            setLocalData(data);
        }
    }, [isOpen, data]);

    if (!isOpen || !localData) return null;

    const cvSectionLabels: Record<string, string> = {
        photo: 'Photograph',
        contact: 'Contact',
        educations: 'Education',
        workExperience: 'Work Experience',
        projects: 'Projects',
        skills: 'Skills',
        languages: 'Languages',
        certifications: 'Certifications',
        awards: 'Awards',
        hobbies: 'Hobbies',
        references: 'References',
    };

    // CV bölümlerinin görünürlüğü
    const toggleCvSectionVisibility = (section: string) => {
        setLocalData((prev: any) => {
        if (section === 'photo') {
            return {
                ...prev,
                personalInformation: {
                    ...prev.personalInformation,
                    photo: {
                        ...prev.personalInformation.photo,
                        visibility: !prev.personalInformation.photo.visibility,
                    },
                },
            };
        }

            return {
                ...prev,
                [section]: {
                    ...prev[section],
                    visibility: !prev[section].visibility,
                },
            };
        });
    };

    // Bölümün genel görünürlüğü
    const toggleSectionVisibility = () => {
        setLocalData((prev: any) => ({
            ...prev,
            visibility: !prev.visibility,
        }));
    };

    // Ana içerik görünürlüğü
    const toggleVisibility = (index: number) => {
        setLocalData((prev: any) => ({
            ...prev,
            content: prev.content.map((item: any, i: number) =>
                i === index
                    ? { ...item, visibility: !item.visibility }
                    : item
            ),
        }));
    };

    // Alt içerik görünürlüğü
    const toggleSubItemVisibility = (
        sectionIndex: number,
        subIndex: number
    ) => {
        setLocalData((prev: any) => ({
            ...prev,
            content: prev.content.map((item: any, index: number) => {
                if (index !== sectionIndex) return item;

                const field = title === 'workExperience'
                    ? 'responsibilities'
                    : 'subclause';

                return {
                    ...item,
                    [field]: (item[field] ?? []).map(
                        (sub: any, i: number) =>
                            i === subIndex
                                ? { ...sub, visibility: !sub.visibility }
                                : sub
                    ),
                };
            }),
        }));
    };

    // Skill alt içerik görünürlüğü
    const toggleSkillItemVisibility = (
        sectionIndex: number,
        subIndex: number
    ) => {
        setLocalData((prev: any) => ({
            ...prev,
            content: prev.content.map((item: any, index: number) => {
                if (index !== sectionIndex) return item;

                return {
                    ...item,
                    items: (item.items ?? []).map(
                        (sub: any, i: number) =>
                            i === subIndex
                                ? { ...sub, visibility: !sub.visibility }
                                : sub
                    ),
                };
            }),
        }));
    };

    // Summary görünürlüğü
    const toggleSummaryVisibility = (field: string) => {
        setLocalData((prev: any) => {
            const otherField = field === 'careerSummary'
                ? 'careerGoals'
                : 'careerSummary';

            const otherItem = prev[otherField];

            if (!otherItem?.text) return prev;

            const newVisibility = !prev[field].visibility;

            const updated = {
                ...prev,
                [field]: {
                    ...prev[field],
                    visibility: newVisibility,
                },
            };

            if (!newVisibility && !otherItem.visibility) {
                updated[otherField] = {
                    ...otherItem,
                    visibility: true,
                };
            }

            return updated;
        });
    };

    // Fotoğraf görünürlüğü
    const togglePhotoVisibility = () => {
        setLocalData((prev: any) => ({
            ...prev,
            visibility: !prev.visibility,
        }));
    };

    const handleSave = () => {
        onSave(localData);
        onClose();
    };

    // Görünürlük kontrolü
    const VisibilityControl = ({
        checked,
        onChange,
    }: {
        checked: boolean;
        onChange: () => void;
    }) => (
        <Pressable
            style={styles.visibilityControl}
            onPress={onChange}
        >
            <Text style={styles.visibilityText}>
                {checked ? 'Show' : 'Hide'}
            </Text>

            <View
                style={[
                    styles.visibilitySwitch,
                    checked && styles.visibilitySwitchActive,
                ]}
            >
                <View
                    style={[
                        styles.switchCircle,
                        checked && styles.switchCircleActive,
                    ]}
                />
            </View>
        </Pressable>
    );

    // İçerik başlığı
    const getItemTitle = (item: any) => {
        switch (title) {
            case 'contact':
                return item.value;

            case 'educations':
                return (
                    <View>
                        {item.Department ? (
                            <Text style={{ fontWeight: 'bold' }}>
                                {item.Department}
                            </Text>
                        ) : null}

                        <Text>{item.SchoolName}</Text>
                    </View>
                );

            case 'workExperience':
                return item.CompanyName;

            case 'projects':
                return item.ProjectName;

            case 'skills':
                return item.Title;

            case 'languages':
            case 'hobbies':
            case 'references':
                return item.Name;

            case 'certifications':
            case 'awards':
                return (
                    <View>
                        <Text style={{ fontWeight: 'bold' }}>
                            {item.Title}
                        </Text>

                        <Text>{item.Issuer}</Text>
                    </View>
                );

            default:
                return item.title ?? item.name;
        }
    };

    return (
        <Modal
            visible={isOpen}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <Pressable
                style={styles.overlay}
                onPress={onClose}
            >
                <Pressable
                    style={styles.modal}
                    onPress={() => {}}
                >

                    {/* HEADER */}
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>
                            {title === 'workExperience'
                                ? 'WORK EXPERIENCE'
                                : title === 'cvSections'
                                    ? 'CV SECTIONS'
                                    : title.toUpperCase()}
                        </Text>

                        <Pressable
                            style={styles.closeButton}
                            onPress={onClose}
                        >
                            <Text style={{ fontSize: 26 }}>×</Text>
                        </Pressable>
                    </View>

                    {/* CONTENT */}
                    <ScrollView
                        style={styles.content}
                        showsVerticalScrollIndicator={false}
                    >

                        {/* CV SECTIONS */}
                        {title === 'cvSections' && (
                            <>
                                {Object.entries(cvSectionLabels).map(
                                    ([key, label]) => {
                                        const section = key === 'photo'
                                            ? localData.personalInformation?.photo
                                            : localData[key];

                                        if (!section) return null;

                                        return (
                                            <View
                                                style={styles.row}
                                                key={key}
                                            >
                                                <View style={styles.item}>
                                                    <Text style={{ fontWeight: 'bold' }}>
                                                        {label}
                                                    </Text>
                                                </View>

                                                <VisibilityControl
                                                    checked={section.visibility ?? true}
                                                    onChange={() =>
                                                        toggleCvSectionVisibility(key)
                                                    }
                                                />
                                            </View>
                                        );
                                    }
                                )}
                            </>
                        )}

                        {/* PHOTO */}
                        {title === 'photo' && (
                            <View style={styles.row}>
                                <View style={styles.item}>
                                    <Text style={{ fontWeight: 'bold' }}>
                                        Photograph
                                    </Text>
                                </View>

                                <VisibilityControl
                                    checked={localData.visibility}
                                    onChange={togglePhotoVisibility}
                                />
                            </View>
                        )}

                        {/* SUMMARY */}
                        {title === 'summary' && (
                            <>
                                {['careerSummary', 'careerGoals'].map(
                                    field => {
                                        const item = localData[field];

                                        if (!item?.text) return null;

                                        return (
                                            <View
                                                style={styles.row}
                                                key={field}
                                            >
                                                <View style={styles.item}>
                                                    <Text style={{ fontWeight: 'bold' }}>
                                                        {field === 'careerSummary'
                                                            ? 'Career Summary'
                                                            : 'Career Goals'}
                                                    </Text>

                                                    <Text style={styles.itemDescription}>
                                                        {item.text}
                                                    </Text>
                                                </View>

                                                <VisibilityControl
                                                    checked={item.visibility}
                                                    onChange={() =>
                                                        toggleSummaryVisibility(field)
                                                    }
                                                />
                                            </View>
                                        );
                                    }
                                )}
                            </>
                        )}

                        {/* NORMAL SECTIONS */}
                        {title !== 'photo' &&
                            title !== 'summary' &&
                            title !== 'cvSections' && (
                                <>
                                    <View
                                        style={[
                                            styles.row,
                                            styles.mainToggle,
                                        ]}
                                    >
                                        <Text style={{ fontWeight: 'bold' }}>
                                            {title.toUpperCase()}
                                        </Text>

                                        <VisibilityControl
                                            checked={localData.visibility}
                                            onChange={toggleSectionVisibility}
                                        />
                                    </View>

                                    {(localData.content ?? []).map(
                                        (item: any, index: number) => {

                                            if (
                                                title === 'contact' &&
                                                !item.value
                                            ) {
                                                return null;
                                            }

                                            return (
                                                <View
                                                    key={item.Id ?? index}
                                                >
                                                    {/* MAIN ITEM */}
                                                    <View style={styles.row}>
                                                        <View style={styles.item}>
                                                            {getItemTitle(item)}
                                                        </View>

                                                        <VisibilityControl
                                                            checked={item.visibility}
                                                            onChange={() =>
                                                                toggleVisibility(index)
                                                            }
                                                        />
                                                    </View>

                                                    {/* WORK EXPERIENCE */}
                                                    {title === 'workExperience' && (
                                                        <View style={styles.subitems}>
                                                            {(item.responsibilities ?? []).map(
                                                                (sub: any, subIndex: number) => (
                                                                    <View
                                                                        style={styles.subitemRow}
                                                                        key={sub.Id ?? subIndex}
                                                                    >
                                                                        <Text style={{ flex: 1 }}>
                                                                            {sub.description}
                                                                        </Text>

                                                                        <VisibilityControl
                                                                            checked={sub.visibility}
                                                                            onChange={() =>
                                                                                toggleSubItemVisibility(
                                                                                    index,
                                                                                    subIndex
                                                                                )
                                                                            }
                                                                        />
                                                                    </View>
                                                                )
                                                            )}
                                                        </View>
                                                    )}

                                                    {/* PROJECT SUBCLAUSES */}
                                                    {title === 'projects' && (
                                                        <View style={styles.subitems}>
                                                            {(item.subclause ?? []).map(
                                                                (sub: any, subIndex: number) => (
                                                                    <View
                                                                        style={styles.subitemRow}
                                                                        key={sub.Id ?? subIndex}
                                                                    >
                                                                        <Text style={{ flex: 1 }}>
                                                                            {sub.text}
                                                                        </Text>

                                                                        <VisibilityControl
                                                                            checked={sub.visibility ?? true}
                                                                            onChange={() =>
                                                                                toggleSubItemVisibility(
                                                                                    index,
                                                                                    subIndex
                                                                                )
                                                                            }
                                                                        />
                                                                    </View>
                                                                )
                                                            )}
                                                        </View>
                                                    )}

                                                    {/* SKILL ITEMS */}
                                                    {title === 'skills' && (
                                                        <View style={styles.subitems}>
                                                            {(item.items ?? []).map(
                                                                (sub: any, subIndex: number) => (
                                                                    <View
                                                                        style={styles.subitemRow}
                                                                        key={sub.Id ?? subIndex}
                                                                    >
                                                                        <Text style={{ flex: 1 }}>
                                                                            {sub.Name}
                                                                        </Text>

                                                                        <VisibilityControl
                                                                            checked={sub.visibility ?? true}
                                                                            onChange={() =>
                                                                                toggleSkillItemVisibility(
                                                                                    index,
                                                                                    subIndex
                                                                                )
                                                                            }
                                                                        />
                                                                    </View>
                                                                )
                                                            )}
                                                        </View>
                                                    )}
                                                </View>
                                            );
                                        }
                                    )}
                                </>
                            )}

                    </ScrollView>

                    {/* FOOTER */}
                    <View style={styles.footer}>
                        <Pressable
                            style={[
                                styles.footerButton,
                                styles.cancelButton,
                            ]}
                            onPress={onClose}
                        >
                            <Text style={styles.cancelButtonText}>
                                Cancel
                            </Text>
                        </Pressable>

                        <Pressable
                            style={[
                                styles.footerButton,
                                styles.saveButton,
                            ]}
                            onPress={handleSave}
                        >
                            <Text style={styles.saveButtonText}>
                                Save
                            </Text>
                        </Pressable>
                    </View>

                </Pressable>
            </Pressable>
        </Modal>
    );
};

export default SectionModal;
