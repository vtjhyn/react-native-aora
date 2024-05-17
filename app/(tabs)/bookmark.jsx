import {
  View,
  Text,
  FlatList,
  RefreshControl,
  Image,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchInput from "../../components/SearchInput";
import { getSavedPosts } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import VideoCard from "../../components/VideoCard";
import { useGlobalContext } from "../../context/GlobalProvider";
import { images } from "../../constants";

const Bookmark = () => {
  const { user } = useGlobalContext();
  const {
    data: posts,
    refetch,
    isLoading: isLoadingBookmark,
  } = useAppwrite(() => getSavedPosts(user.$id));
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      {isLoadingBookmark ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator color="#FF9C01" size="large" />
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) => <VideoCard video={item} />}
          ListHeaderComponent={() => (
            <View className="my-6 px-4">
              <Text className="text-2xl font-psemibold text-white">
                Saved Videos
              </Text>
              <View className="mt-6 mb-8">
                <SearchInput />
              </View>
            </View>
          )}
          ListEmptyComponent={() => (
            <View className="justify-center items-center px-4">
              <Image
                source={images.empty}
                className="w-[270px] h-[215px]"
                resizeMode="contain"
              />
              <Text className="text-xl text-center font-psemibold text-white mt-2">
                No Videos Found
              </Text>
              <Text className="font-pmedium text-sm text-gray-100">
                There's no videos added to bookmark
              </Text>
            </View>
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </SafeAreaView>
  );
};

export default Bookmark;
