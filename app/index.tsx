import { useState } from "react";
import { Text, ScrollView, View, Pressable } from "react-native";
import { Stack } from "expo-router";
import sales from "@/constants/sales.json";

export default function HomeScreen() {
  const [selectedDateRange, setSelectedDateRange] =
    useState("fridayAndSaturday");

  const filteredSales =
    selectedDateRange === "fridayAndSaturday"
      ? sales.filter((sale) => sale.saturday && sale.friday)
      : sales.filter((sale) => !sale.friday);

  return (
    <ScrollView
      contentContainerStyle={{ flex: 1, marginHorizontal: 20, marginTop: 10 }}
    >
      <Stack.Screen options={{ title: "South Hills Garage Sales" }} />
      <View style={{ width: "100%", height: 400 }}>
        <iframe
          src="https://app.mapline.com/map/map_73ea4855/UVNuVWh4bnVCbkNjcXhKSWowT05iMmRuNkQ2S01NNE42c0V1Rm"
          style={{ width: "100%", height: 400 }}
          allow="geolocation *"
        ></iframe>
      </View>
      <View
        style={{
          marginTop: 10,
          marginBottom: 10,
          marginHorizontal: 50,
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <Pressable
          onPress={() => setSelectedDateRange("saturdayOnly")}
          style={{
            backgroundColor:
              selectedDateRange === "saturdayOnly" ? "blue" : "transparent",
            padding: 10,
            borderColor: "blue",
            borderWidth: 1,
          }}
        >
          <Text
            style={{
              color: selectedDateRange === "saturdayOnly" ? "white" : "black",
            }}
          >
            Saturday Only
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setSelectedDateRange("fridayAndSaturday")}
          style={{
            backgroundColor:
              selectedDateRange === "fridayAndSaturday"
                ? "green"
                : "transparent",
            borderColor: "green",
            borderWidth: 1,
            padding: 10,
          }}
        >
          <Text
            style={{
              color:
                selectedDateRange === "fridayAndSaturday" ? "white" : "black",
            }}
          >
            Friday and Saturday
          </Text>
        </Pressable>
      </View>
      <View style={{ marginTop: 10, rowGap: 10 }}>
        {filteredSales.map((sale) => (
          <Text
            key={sale.address}
            style={{ fontSize: 18, textAlign: "center" }}
          >
            {sale.address}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
}
