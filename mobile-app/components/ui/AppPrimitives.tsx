import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ViewStyle,
  StyleProp,
  StyleSheet,
} from "react-native";
import { themeStyles } from "../../styles/theme";
import { colors, radius, spacing } from "../../styles/tokens";

type SectionCardProps = {
  title?: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

type SecondaryButtonProps = {
  label: string;
  onPress: () => void;
  accessibilityLabel?: string;
};

type StatusChipProps = {
  text: string;
  style?: StyleProp<ViewStyle>;
};

type FloatingActionButtonProps = {
  label: string;
  onPress: () => void;
  accessibilityLabel?: string;
};

export function SectionCard({ title, children, style }: SectionCardProps) {
  return (
    <View
      style={[styles.sectionCard, style]}
    >
      {title ? (
        <Text style={[themeStyles.clueTitle, { fontSize: 18, marginTop: 0 }]}>
          {title}
        </Text>
      ) : null}
      {children}
    </View>
  );
}

export function SecondaryButton({
  label,
  onPress,
  accessibilityLabel,
}: SecondaryButtonProps) {
  return (
    <TouchableOpacity
      style={[themeStyles.solveButton, styles.secondaryButton]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
    >
      <Text style={themeStyles.solveButtonText}>{label}</Text>
    </TouchableOpacity>
  );
}

export function StatusChip({ text, style }: StatusChipProps) {
  return (
    <View
      style={[styles.statusChip, style]}
    >
      <Text style={styles.statusChipText}>{text}</Text>
    </View>
  );
}

export function FloatingActionButton({
  label,
  onPress,
  accessibilityLabel,
}: FloatingActionButtonProps) {
  return (
    <TouchableOpacity
      style={styles.fab}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
    >
      <Text style={styles.fabText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  sectionCard: {
    width: "90%",
    backgroundColor: colors.bgSurface,
    borderColor: colors.accentGold,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    opacity: 0.95,
  },
  secondaryButton: {
    alignSelf: "center",
  },
  statusChip: {
    alignSelf: "center",
    backgroundColor: colors.bgSurface,
    opacity: 0.95,
    borderWidth: 1,
    borderColor: colors.accentGold,
    borderRadius: radius.lg,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  statusChipText: {
    color: colors.textPrimary,
    fontWeight: "600",
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: colors.accentGold,
    borderRadius: 30,
    padding: 14,
    elevation: 4,
  },
  fabText: {
    color: colors.textDark,
    fontWeight: "bold",
  },
});
