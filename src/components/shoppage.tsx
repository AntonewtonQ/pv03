"use client";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import ProductCard from "./productcard";
import { db } from "@/lib/firebase";
import { Button } from "./ui/button";
import { ArrowDownWideNarrow, ArrowUpNarrowWide } from "lucide-react";

interface Item {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
}

const Loja = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [sortAscending, setSortAscending] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // Novo estado para pesquisa

  useEffect(() => {
    const fetchItems = async () => {
      const querySnapshot = await getDocs(collection(db, "items"));
      const fetchedItems = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Item[];
      setItems(fetchedItems);
    };
    fetchItems();
  }, []);

  const sortedItems = [...items]
    .filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      return sortAscending
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    });

  const handleToggleSort = () => {
    setSortAscending((prev) => !prev);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <>
      <div className="text-white px-6 md:px-14 py-6">
        <div className="mx-auto px-10 max-w-6xl flex flex-col gap-6">
          {/* Área de controles: pesquisa e ordenação */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Caixa de Pesquisa */}
            <input
              type="text"
              placeholder="Search shirts..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="py-1 px-2 border placeholder:text-sm border-muted-foreground rounded-md text-white bg-black w-full md:w-1/2 shadow-md focus:outline-none focus:ring-2 focus:ring-muted-foreground focus:ring-opacity-20"
            />
            {/* Botão de Toggle */}
            <Button
              onClick={handleToggleSort}
              className="text-white bg-black border-muted-foreground border rounded-md shadow-md hover:bg-white hover:text-black transition"
            >
              {sortAscending ? <ArrowUpNarrowWide /> : <ArrowDownWideNarrow />}

              {sortAscending ? "Sort: A-Z" : "Sort: Z-A"}
            </Button>
          </div>

          <div className="space-y-4 mb-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
              {sortedItems.length > 0 ? (
                sortedItems.map((item) => (
                  <ProductCard key={item.id} item={item} />
                ))
              ) : (
                <div className="col-span-full text-center text-gray-400">
                  No items found.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Loja;
