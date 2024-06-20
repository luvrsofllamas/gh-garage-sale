import { useState, useEffect } from "react";
import {
  Text,
  ScrollView,
  View,
  Pressable,
  useWindowDimensions,
} from "react-native";
import { Stack } from "expo-router";
import sales from "@/constants/sales.json";
import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import CheckBox from "expo-checkbox";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SegmentedControl = (
  {
    items,
    onSetItemIndex,
    selectedIndex,
  } /*: { items: { title: string, color: string}[], onSetItemIndex: number => void }*/
) => {
  return (
    <View
      style={{
        marginTop: 10,
        marginBottom: 10,
        marginHorizontal: 50,
        flexDirection: "row",
        justifyContent: "center",
      }}
    >
      {items.map((item, index) => (
        <Pressable
          key={item.title}
          onPress={() => onSetItemIndex(index)}
          style={{
            backgroundColor:
              selectedIndex === index ? item.color : "transparent",
            padding: 10,
            paddingHorizontal: 20,
            borderColor: item.color,
            borderWidth: 1,
          }}
        >
          <Text
            style={{
              color: selectedIndex === index ? "white" : item.color,
            }}
          >
            {item.title}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

export default function HomeScreen() {
  const [filterIndex, setFilterIndex] = useState(2);

  const [selectedItem, setSelectedItem] = useState<string | undefined>(
    undefined
  );

  const [selectedSales, setSelectedSales] = useState<any>({});

  const windowDimensions = useWindowDimensions();

  // clear selected sale if not in list
  useEffect(() => {
    if (selectedItem && !sales.find((sale) => sale.address === selectedItem)) {
      setSelectedItem(undefined);
    }
  }, [selectedItem]);

  // load selected sales from local storage
  useEffect(() => {
    AsyncStorage.getItem("selectedSales").then((value) => {
      if (!value) return;
      setSelectedSales(JSON.parse(value));
    });
  }, []);

  // save selected sales to local storage
  useEffect(() => {
    AsyncStorage.setItem("selectedSales", JSON.stringify(selectedSales));
  }, [selectedSales]);

  const filteredSales =
    filterIndex === 0
      ? sales.filter((sale) => sale.friday)
      : filterIndex === 1
      ? sales.filter((sale) => sale.saturday)
      : sales; // TODO: sort by street name

  const filterItems = [
    { title: "Friday", color: "blue" },
    { title: "Saturday", color: "green" },
    { title: "All", color: "purple" },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ width: "100%", height: windowDimensions.height / 2 }}>
        <APIProvider apiKey={process.env.EXPO_PUBLIC_MAPS_API_KEY as string}>
          <Map
            mapId={"c1d957b78da88177"}
            style={{ width: "100%", height: "100%" }}
            defaultCenter={{ lat: 41.43163317037717, lng: -81.69252125368092 }}
            defaultZoom={15.2}
            gestureHandling={"greedy"}
            disableDefaultUI={true}
          >
            {filteredSales.map((sale) => (
              <AdvancedMarker key={sale.address} position={sale.coords}>
                <View
                  style={{
                    backgroundColor: filterItems[filterIndex].color,
                    height: 16,
                    width: 16,
                    borderRadius: 8,
                  }}
                ></View>
              </AdvancedMarker>
            ))}
            {selectedItem && (
              <AdvancedMarker
                key={"selected"}
                position={
                  sales.find((sale) => sale.address === selectedItem)?.coords
                }
              >
                <View
                  style={{
                    backgroundColor: "yellow",
                    height: 24,
                    width: 24,
                    borderRadius: 12,
                    borderWidth: 6,
                    borderColor: filterItems[filterIndex].color,
                  }}
                ></View>
              </AdvancedMarker>
            )}
          </Map>
        </APIProvider>
      </View>
      <SegmentedControl
        items={filterItems}
        onSetItemIndex={setFilterIndex}
        selectedIndex={filterIndex}
      />
      <ScrollView
        contentContainerStyle={{ flex: 1, marginHorizontal: 20, marginTop: 10 }}
      >
        <Stack.Screen options={{ title: "South Hills Garage Sales" }} />
        <View style={{ marginTop: 10, rowGap: 5 }}>
          {filteredSales.map((sale) => (
            <View
              key={sale.address}
              style={{
                flexDirection: "row",
                paddingLeft: 10,
                alignItems: "center",
                height: 40,
                backgroundColor:
                  selectedItem === sale.address ? "yellow" : undefined,
              }}
            >
              <CheckBox
                value={!!selectedSales[sale.address]}
                onValueChange={(checked) =>
                  setSelectedSales({
                    ...selectedSales,
                    [sale.address]: checked,
                  })
                }
              />
              <Pressable
                style={{ flex: 1 }}
                onPress={() => setSelectedItem(sale.address)}
              >
                <View style={{ flex: 1, flexDirection: "row" }}>
                  <Text style={{ fontSize: 20, paddingLeft: 10 }}>
                    {sale.address}
                  </Text>

                  {!sale.friday && sale.saturday && (
                    <Text
                      style={{
                        fontSize: 12,
                        paddingLeft: 8,
                        color: "green",
                        alignSelf: "flex-start",
                      }}
                    >
                      SAT ONLY
                    </Text>
                  )}
                </View>
              </Pressable>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
