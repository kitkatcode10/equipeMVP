import React from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';

// Define a Product type
type Product = {
  id: string;
  name: string;
  image: string;
};

// Sample data for products
const sampleProducts: Product[] = [
  { id: '1', name: 'Oura Ring', image: 'https://via.placeholder.com/150' },
  { id: '2', name: 'Garmin Varia Light', image: 'https://via.placeholder.com/150' },
  { id: '3', name: 'Whoop Health Tracker', image: 'https://via.placeholder.com/150' },
  { id: '4', name: 'Cyclplus Electric Bike Pump', image: 'https://via.placeholder.com/150' },
  { id: '5', name: 'Assioma Power Pedals', image: 'https://via.placeholder.com/150' },
];

const ProductsScreen = () => {
  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity style={styles.productItem}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <Text style={styles.productName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Top Reviewed Products Today</Text>
      <FlatList
        data={sampleProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  productItem: {
    width: '100%',
    marginBottom: 15,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    borderRadius: 4,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
});

export default ProductsScreen;