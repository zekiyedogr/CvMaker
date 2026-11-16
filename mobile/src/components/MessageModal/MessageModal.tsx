import React from 'react';
import { Modal as RNModal, View, Text } from 'react-native';

import BaseButton from '../BaseButton/BaseButton';
import styles from './MessageModal.styles';

interface ModalProps {
    visible: boolean;
    type: 'message' | 'error' | 'confirm';
    title: string;
    message: string;
    onClose: () => void;
    onConfirm?: () => void;
    confirmText?: string;
    cancelText?: string;
}

const MessageModal = ({
    visible,
    type,
    title,
    message,
    onClose,
    onConfirm,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
}: ModalProps) => {

    const handleConfirm = () => {
        onConfirm?.();
        onClose();
    };

    return (
        <RNModal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Text
                        style={[
                            styles.title,
                            type === 'error' && styles.errorTitle,
                        ]}
                    >
                        {title}
                    </Text>

                    <Text style={styles.message}>
                        {message}
                    </Text>

                    <View style={styles.buttons}>
                        {type === 'confirm' ? (
                            <>
                                <View style={styles.buttonWrapper}>
                                    <BaseButton
                                        title={cancelText}
                                        onPress={onClose}
                                    />
                                </View>

                                <View style={styles.buttonWrapper}>
                                    <BaseButton
                                        title={confirmText}
                                        onPress={handleConfirm}
                                    />
                                </View>
                            </>
                        ) : (
                            <View style={styles.buttonWrapper}>
                                <BaseButton
                                    title="Tamam"
                                    onPress={onClose}
                                />
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </RNModal>
    );
};

export default MessageModal;