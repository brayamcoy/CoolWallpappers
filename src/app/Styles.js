import { StyleSheet } from "react-native";
import { SPACING, IMAGE_SIZE } from "./config";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  flatlistContainer: {
    paddingHorizontal: SPACING,
  },
  flatlist: {
    position: "absolute",
    bottom: IMAGE_SIZE,
  },
});

export { styles };
