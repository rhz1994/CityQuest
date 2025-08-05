import React, { useState } from "react";
import { View, Text, FlatList } from "react-native";
import { themeStyles } from "../../styles/theme";

export default function AccountScreen() {
  // dummy-data
  const [completedQuests] = useState([
    { id: 1, title: "Mysteriet i Gamla Stan" },
    { id: 2, title: "Skattjakten i Slottet" },
  ]);
  const [savedQuests] = useState([{ id: 3, title: "Hemliga biblioteket" }]);

  return (
    <View style={themeStyles.container}>
      <Text style={themeStyles.container}>Mitt Konto</Text>
      <Text style={themeStyles.clueTitle}>Avklarade quests</Text>{" "}
      <FlatList
        data={completedQuests}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text style={themeStyles.questDesc}> • {item.title} </Text>
        )}
        ListEmptyComponent={
          <Text style={themeStyles.clueDesc}>
            {" "}
            Inga avklarade quests än så länge
          </Text>
        }
      />{" "}
      <Text style={[themeStyles.clueTitle, { marginTop: 24 }]}>
        Sparade quests
      </Text>{" "}
      <FlatList
        data={savedQuests}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text style={themeStyles.questDesc}> • {item.title} </Text>
        )}
        ListEmptyComponent={
          <Text style={themeStyles.clueDesc}>Inga sparade quests.</Text>
        }
      />
    </View>
  );
}
