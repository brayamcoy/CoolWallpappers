import React from "react";
import {
  FlatList,
  Image,
  Text,
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import ImageZoom from "react-native-image-pan-zoom";
import { styles } from "./Styles";
import { API_KEY, API_URL, SPACING, IMAGE_SIZE } from "./config";
const { width, height } = Dimensions.get("screen");

export default function ViewWallpappers() {
  const [images, setImages] = React.useState(null);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const topRef = React.useRef();
  const thumbRef = React.useRef();

  const getWallpappersRequest = async () => {
    const options = {
      headers: {
        Authorization: API_KEY,
      },
    };
    const data = await fetch(API_URL, options);
    const results = data.json();

    return results;
  };

  const scrollToActiveIndex = (index) => {
    setActiveIndex(index);
    topRef.current.scrollToOffset({
      offset: index * width,
      animated: true,
    });
    if (index * (IMAGE_SIZE + SPACING) - IMAGE_SIZE / 2 > width / 2) {
      thumbRef.current.scrollToOffset({
        offset: index * (IMAGE_SIZE + SPACING) - width / 2 + IMAGE_SIZE / 2,
        animated: true,
      });
    } else {
      thumbRef.current.scrollToOffset({
        offset: 0,
        animated: true,
      });
    }
  };

  React.useEffect(() => {
    const getWallpappers = async () => {
      const results = await getWallpappersRequest();
      setImages(results.photos);
    };
    getWallpappers();
  }, []);

  if (!images) {
    return <Text>Loading!</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={topRef}
        data={images}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          scrollToActiveIndex(
            Math.floor(e.nativeEvent.contentOffset.x / width)
          );
        }}
        renderItem={({ item }) => {
          return (
            <View style={{ width, height }}>
              <ImageZoom
                cropWidth={Dimensions.get("window").width}
                cropHeight={Dimensions.get("window").height}
                imageWidth={width}
                imageHeight={height}
                pinchToZoom={true}
              >
                <Image
                  source={{ uri: item.src.portrait }}
                  style={StyleSheet.absoluteFillObject}
                />
              </ImageZoom>
            </View>
          );
        }}
      />
      <FlatList
        ref={thumbRef}
        data={images}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.flatlist}
        contentContainerStyle={styles.flatlistContainer}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity onPress={() => scrollToActiveIndex(index)}>
              <Image
                source={{ uri: item.src.portrait }}
                style={{
                  width: IMAGE_SIZE,
                  height: IMAGE_SIZE,
                  borderRadius: 12,
                  borderWidth: 2,
                  marginRight: SPACING,
                  borderColor: activeIndex === index ? "#FFF" : "transparent",
                }}
              />
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}
