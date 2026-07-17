"use client";

import {
  Package,
  ShoppingCart,
  GraduationCap,
} from "lucide-react";
import CourseTable from "@/components/admin/courses/course-table";
import CourseForm from "@/components/admin/courses/course-form";
import AddCourseDialog from "@/components/admin/courses/add-course-dialog";
import { toast } from "sonner";
import ProductTable from "@/components/admin/products/product-table";
import ProductForm from "@/components/admin/product-form";

import DashboardCard from "@/components/admin/dashboard-card";

import SiteLayout from "@/components/layout/site-layout";
import { useEffect, useState } from "react";
import AddProductDialog from "@/components/admin/products/add-product-dialog";
import {
  addDoc,
  collection,
  getCountFromServer,
} from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { useUserRole } from "@/hooks/use-user-role";
import { products } from "@/data/products";

export default function AdminPage() {
  const role = useUserRole();

  const [name, setName] =
    useState("");

  const [slug, setSlug] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [price, setPrice] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [courseName, setCourseName] =
  useState("");

  const [courseLevel, setCourseLevel] =
    useState("");

  const [courseDuration, setCourseDuration] =
    useState("");

  const [courseDescription,
    setCourseDescription] =
    useState("");

  const [productFile,
    setProductFile] =
    useState<File | null>(null);

  const [courseFile,
    setCourseFile] =
    useState<File | null>(null);

  const [productCount,
    setProductCount] =
    useState(0);

  const [courseCount,
    setCourseCount] =
    useState(0);

  const [orderCount,
    setOrderCount] =
    useState(0);

  const [addProductOpen, setAddProductOpen] =
    useState(false);

  const [addCourseOpen, setAddCourseOpen] =
    useState(false);

  async function handleAddProduct() {
    try {
      let uploadedImageUrl = "";

      if (productFile) {
        uploadedImageUrl =
          await uploadToCloudinary(
            productFile
          );
      }
      await addDoc(
        collection(db, "products"),
        {
          name,
          slug,
          category,
          price: Number(price),
          description,
          imageUrl:
            uploadedImageUrl,
        }
      );

      toast.success("Product added successfully!");

      setName("");
      setSlug("");
      setCategory("");
      setPrice("");
      setDescription("");
      setProductFile(null);
    } catch (error) {
      console.error(error);

      toast.error("Failed to add product.");
    }
  }

  async function importDefaultProducts() {
    try {
      for (const product of products) {
        await addDoc(
          collection(db, "products"),
          {
            name: product.name,
            slug: product.slug,
            category: product.category,
            price: product.price,
            description:
              product.description,
            imageUrl: "",
          }
        );
      }

      alert("Products imported");
    } catch (error) {
      console.error(error);
    }
  }

  async function uploadToCloudinary(
    file: File
  ) {
    const formData =
      new FormData();

    formData.append(
      "file",
      file
    );

    formData.append(
      "upload_preset",
      "mtedftib"
    );

    const response =
      await fetch(
        "https://api.cloudinary.com/v1_1/dhozramhs/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

    const data =
      await response.json();

    if (!data.secure_url) {
      throw new Error(
        "Cloudinary upload failed"
      );
    }

    return data.secure_url;
  }

  async function handleAddCourse() {
    try {
      let uploadedImageUrl = "";

      if (courseFile) {
        uploadedImageUrl =
          await uploadToCloudinary(
            courseFile
          );
      }
      await addDoc(
        collection(db, "courses"),
        {
          name: courseName,
          slug: courseName
            .toLowerCase()
            .replace(/\s+/g, "-"),
          level: courseLevel,
          duration: courseDuration,
          description:
            courseDescription,
          imageUrl:
            uploadedImageUrl,
        }
      );

      toast.success("Course added successfully!");

      setCourseName("");
      setCourseLevel("");
      setCourseDuration("");
      setCourseDescription("");
      setCourseFile(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to add course.");
    }
  }

  useEffect(() => {

    async function loadCounts() {

      const products =
        await getCountFromServer(
          collection(
            db,
            "products"
          )
        );

      const courses =
        await getCountFromServer(
          collection(
            db,
            "courses"
          )
        );

      const orders =
        await getCountFromServer(
          collection(
            db,
            "orders"
          )
        );

      setProductCount(
        products.data().count
      );

      setCourseCount(
        courses.data().count
      );

      setOrderCount(
        orders.data().count
      );

    }

    if (role === "admin") {
      loadCounts();
    }

  }, [role]);

  if (role !== "admin") {
    return (
      <main className="p-10">
        Access Denied
      </main>
    );
  }

  return (

    <SiteLayout>

      <main className="mx-auto max-w-7xl px-6 py-24">

      <div className="mb-12">

        <h1 className="text-5xl font-bold">
          Dashboard
        </h1>

        <p className="mt-3 text-slate-500">
          Manage orders, products and courses from one place.
        </p>

      </div>

      <div
        className="
          mb-16
          grid
          gap-6
          md:grid-cols-3
        "
      >

        <DashboardCard
          title="Orders"
          count={orderCount}
          subtitle="Total Orders"
          href="/admin/orders"
          icon={Package}
          bgColor="bg-blue-100"
          iconColor="text-blue-600"
          numberColor="text-blue-600"
        />

        <DashboardCard
          title="Products"
          count={productCount}
          subtitle="Products"
          href="#products"
          icon={ShoppingCart}
          bgColor="bg-emerald-100"
          iconColor="text-emerald-600"
          numberColor="text-emerald-600"
        />

        <DashboardCard
          title="Courses"
          count={courseCount}
          subtitle="Courses"
          href="#courses"
          icon={GraduationCap}
          bgColor="bg-violet-100"
          iconColor="text-violet-600"
          numberColor="text-violet-600"
        />

      </div>


      <ProductTable
        onAddProduct={() => setAddProductOpen(true)}
      />

      <AddProductDialog
        open={addProductOpen}
        onOpenChange={setAddProductOpen}
      >

        <ProductForm
          name={name}
          setName={setName}
          slug={slug}
          setSlug={setSlug}
          category={category}
          setCategory={setCategory}
          price={price}
          setPrice={setPrice}
          description={description}
          setDescription={setDescription}
          productFile={productFile}
          setProductFile={setProductFile}
          onAddProduct={handleAddProduct}
          onImportProducts={importDefaultProducts}
        />

      </AddProductDialog>

        <CourseTable
          onAddCourse={() => setAddCourseOpen(true)}
        />

        <AddCourseDialog
          open={addCourseOpen}
          onOpenChange={setAddCourseOpen}
        >
          <CourseForm
            courseName={courseName}
            setCourseName={setCourseName}
            courseLevel={courseLevel}
            setCourseLevel={setCourseLevel}
            courseDuration={courseDuration}
            setCourseDuration={setCourseDuration}
            courseDescription={courseDescription}
            setCourseDescription={setCourseDescription}
            courseFile={courseFile}
            setCourseFile={setCourseFile}
            onAddCourse={handleAddCourse}
          />
        </AddCourseDialog>

    </main>

  </SiteLayout>
  );
}