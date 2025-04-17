"use client";
import { useEffect, useState } from "react";

import { collection, getDocs } from "firebase/firestore";
import ProductCard from "./productcard";
import { db } from "@/lib/firebase";

interface Item {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
}

const Loja = () => {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      const querySnapshot = await getDocs(collection(db, "items"));
      setItems(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Item[]
      );
    };
    fetchItems();
  }, []);

  return (
    <>
      <div className="text-white px-6 md:px-14 py-6">
        <div className="mx-auto px-10 max-w-6xl flex flex-col gap-6">
          <div className="space-y-4 mb-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
              {items.map((item) => (
                <ProductCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Loja;
