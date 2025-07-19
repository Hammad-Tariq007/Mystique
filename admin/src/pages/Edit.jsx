import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';


registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);


const Edit = ({token}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const pondRef = useRef();
  const [loading, setLoading] = useState(true);
  const [existingImages, setExistingImages] = useState([]);

  const validationSchema = z.object({
    images: z.any()
      .refine(files => files.length > 0 || existingImages.length > 0, {
        message: 'Please select at least one file or have existing images.',
      })
      .refine(files => files.length + existingImages.length < 5, {
        message: 'You can upload maximus 4 images in total',
      }),
    name: z.string().min(2, { message: 'Enter product name' }),
    description: z.string().min(2, { message: 'Description is required' }),
    price: z.coerce.number().positive({ message: 'Please enter product price' }),
    stock: z.coerce.number().int().min(0, { message: 'Stock must be a non-negative integer' }),
    category: z.enum(['Clothing', 'Accessories', 'Footwear']),
    subcategory: z.enum(['Dresses', 'Tops', 'Bottoms', 'Outerwear', 'Jewelry', 'Bags']),
    sizes: z.array(z.string()).nonempty({ message: 'Choose at least 1 size' }),
    bestseller: z.boolean(),
    newArrival: z.boolean(),
    limitedEdition: z.boolean(),
  });

  const { control, handleSubmit, reset, watch, formState: { errors, isValid, isSubmitting } } = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      images: [],
      name: '',
      description: '',
      price: '',
      stock: 0,
      category: '',
      subcategory: '',
      sizes: [],
      bestseller: false,
      newArrival: false,
      limitedEdition: false,
    },
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/product/get/${id}`);
        if (response.data.success) {
          const product = response.data.product;
          reset({
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            category: product.category,
            subcategory: product.subcategory,
            sizes: product.sizes,
            bestseller: product.bestseller,
            newArrival: product.newArrival,
            limitedEdition: product.limitedEdition,
            images: [], // FilePond will handle new images, existing are displayed separately
          });
          setExistingImages(product.image || []);
        } else {
          toast.error(response.data.message);
          navigate('/list'); // Redirect if product not found
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to fetch product data.');
        navigate('/list'); // Redirect on error
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id, backendUrl, navigate, reset]);
 
  async function onSubmit(values) {
    try {
      const formData = new FormData();

      let sizesWeights = {
        'XS':1, 
        'S':2, 
        'M':3, 
        'L':4, 
        'XL':5
      };
      let sortedSizes = values.sizes.sort((a,b)=>sizesWeights[a]-sizesWeights[b]);

      formData.append('name', values.name);
      formData.append('description', values.description);
      formData.append('price', values.price);
      formData.append('stock', values.stock);
      formData.append('category', values.category);
      formData.append('subcategory', values.subcategory);
      formData.append('sizes', JSON.stringify(sortedSizes));
      formData.append('bestseller', values.bestseller);
      formData.append('newArrival', values.newArrival);
      formData.append('limitedEdition', values.limitedEdition);
      
      // Append new images from FilePond
      for (let i=0; i < values.images.length; i++) {
        formData.append(`image${i+1}`, values.images[i].file);
      }
      // Append existing images if no new ones are uploaded for a slot
      existingImages.forEach((imgUrl, index) => {
        // Only append if there isn't a new image for this 'slot'
        if (!values.images[index]) {
          formData.append(`existingImage${index + 1}`, imgUrl);
        }
      });

      const response = await axios.put(`${backendUrl}/api/product/update/${id}`, formData,
        {headers: {token}}
      );
      if (response.data.success) {
        toast.success(response.data.message);
        navigate('/list'); // Navigate back to list on success
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to update product.');
    }
  }

  const images = watch('images') || [];
  const totalImages = images.length + existingImages.length;

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-purple-100">
        <Loader2 className="h-12 w-12 animate-spin text-pink-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-purple-100 px-4 py-10 transition-all">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8 sm:p-12 flex flex-col gap-8 animate-fade-up">
        {/* Editorial Header */}
        <div className="mb-2">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-1 tracking-tight">Edit Product</h1>
          <div className="w-16 h-1 bg-pink-200 rounded-full mb-2" />
          <p className="text-sm text-gray-500 font-sans">Modify the details of your product below.</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col w-full items-start gap-6">
          {/* Product Images */}
          <div className="w-full">
            <label className="block text-base font-medium font-serif text-gray-800 mb-2">Product Images</label>
            {existingImages.length > 0 && (
              <div className="mb-4 grid grid-cols-4 gap-2">
                {existingImages.map((img, index) => (
                  <div key={index} className="relative">
                    <img src={img} alt={`Existing ${index}`} className="w-full h-24 object-cover rounded-md border border-gray-200" />
                    {/* Add a remove button for existing images if needed, with state management */}
                  </div>
                ))}
              </div>
            )}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 max-w-xl">
              <Controller
                name="images"
                control={control}
                render={({ field }) => (
                  <FilePond
                    {...field}
                    ref={pondRef}
                    className="luxury-filepond"
                    onupdatefiles={fileItems => field.onChange(fileItems)}
                    value={images}
                    acceptedFileTypes={['image/*']}
                    allowReorder={true}
                    allowMultiple={true}
                    imagePreviewHeight={100}
                    styleButtonRemoveItemPosition='right'
                    credits={['https://github.com/ashaldenkov','Powered by Alexey Shaldenkov:)']}
                    labelIdle='Drag & Drop new files or <span class="filepond--label-action">Browse</span>'
                  />
                )}
              />
              {errors.images && <p className="text-red-500 text-xs mt-1">{errors.images.message}</p>}
              <p className="text-xs text-gray-400 mt-1">Upload up to {4 - existingImages.length} new images (max 4 total)</p>
            </div>
          </div>

          {/* Product Name */}
          <div className="w-full">
            <label className="block text-base font-medium font-serif text-gray-800 mb-2">Product Name</label>
            <Controller
              name="name"
              control={control}
              render={({ field, ref }) => (
                <Input
                  {...field}
                  ref={ref}
                  type="text"
                  placeholder="Enter product name"
                  className="w-full px-4 py-3 max-w-xl rounded-lg border border-gray-300 bg-white text-base font-sans shadow-sm focus:ring-2 focus:ring-primary"
                  error={errors.name?.message}
                />
              )}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          {/* Product Description */}
          <div className="w-full">
            <label className="block text-base font-medium font-serif text-gray-800 mb-2">Product Description</label>
            <Controller
              name="description"
              control={control}
              render={({ field, ref }) => (
                <Textarea
                  {...field}
                  ref={ref}
                  type="text"
                  placeholder="Enter description"
                  error={errors.description?.message}
                  className="w-full max-w-xl px-4 py-3 rounded-lg border border-gray-300 bg-white text-base font-sans shadow-sm focus:ring-2 focus:ring-primary"
                />
              )}
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
          </div>

          {/* Stock Quantity */}
          <div className="w-full">
            <label className="block text-base font-medium font-serif text-gray-800 mb-2">Stock Quantity</label>
            <Controller
              name="stock"
              control={control}
              render={({ field, ref }) => (
                <Input
                  {...field}
                  ref={ref}
                  type="number"
                  placeholder="Enter stock quantity"
                  className="w-full px-4 py-3 max-w-xl rounded-lg border border-gray-300 bg-white text-base font-sans shadow-sm focus:ring-2 focus:ring-primary"
                  error={errors.stock?.message}
                />
              )}
            />
            {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock.message}</p>}
          </div>

          {/* Category, Subcategory, Price */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-base font-medium font-serif text-gray-800 mb-2">Category</label>
              <Controller
                name='category'
                control={control}
                render={({ field, ref }) => (
                  <Select {...field} ref={ref} error={errors.category?.message}
                    className='w-full' value={field.value || ''}
                    onValueChange={(value) => field.onChange(value)}>
                    <SelectTrigger className='w-full rounded-lg border border-gray-300 bg-white shadow-sm'>
                      <SelectValue placeholder='Choose...' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='Clothing'>Clothing</SelectItem>
                      <SelectItem value='Accessories'>Accessories</SelectItem>
                      <SelectItem value='Footwear'>Footwear</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
            </div>
            <div>
              <label className="block text-base font-medium font-serif text-gray-800 mb-2">Subcategory</label>
              <Controller
                name='subcategory'
                control={control}
                render={({ field, ref }) => (
                  <Select {...field} ref={ref} error={errors.subcategory?.message}
                    className='w-full' value={field.value || ''}
                    onValueChange={(value) => field.onChange(value)}>
                    <SelectTrigger className='w-full rounded-lg border border-gray-300 bg-white shadow-sm'>
                      <SelectValue placeholder='Choose...' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='Dresses'>Dresses</SelectItem>
                      <SelectItem value='Tops'>Tops</SelectItem>
                      <SelectItem value='Bottoms'>Bottoms</SelectItem>
                      <SelectItem value='Outerwear'>Outerwear</SelectItem>
                      <SelectItem value='Jewelry'>Jewelry</SelectItem>
                      <SelectItem value='Bags'>Bags</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.subcategory && <p className="text-red-500 text-xs mt-1">{errors.subcategory.message}</p>}
            </div>
            <div>
              <label className="block text-base font-medium font-serif text-gray-800 mb-2">Price</label>
              <Controller
                name='price'
                control={control}
                render={({ field, ref }) => (
                  <Input
                    {...field}
                    ref={ref}
                    type="number"
                    placeholder="Enter product price"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-base font-sans shadow-sm focus:ring-2 focus:ring-primary"
                    error={errors.price?.message}
                  />
                )}
              />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
            </div>
          </div>

          {/* Sizes */}
          <div className="w-full">
            <label className="block text-base font-medium font-serif text-gray-800 mb-2">Available Sizes</label>
            <Controller
              name="sizes"
              control={control}
              render={({ field }) => (
                <ToggleGroup type="multiple" value={field.value} onValueChange={(value) => field.onChange(value)} className="flex-wrap">
                  <ToggleGroupItem value="XS">XS</ToggleGroupItem>
                  <ToggleGroupItem value="S">S</ToggleGroupItem>
                  <ToggleGroupItem value="M">M</ToggleGroupItem>
                  <ToggleGroupItem value="L">L</ToggleGroupItem>
                  <ToggleGroupItem value="XL">XL</ToggleGroupItem>
                </ToggleGroup>
              )}
            />
            {errors.sizes && <p className="text-red-500 text-xs mt-1">{errors.sizes.message}</p>}
          </div>

          {/* Product Tags */}
          <div className="w-full flex gap-x-8 gap-y-4 flex-wrap">
            <Controller
              name="bestseller"
              control={control}
              render={({ field }) => (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="bestseller"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <label
                    htmlFor="bestseller"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Bestseller
                  </label>
                </div>
              )}
            />
            <Controller
              name="newArrival"
              control={control}
              render={({ field }) => (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="newArrival"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <label
                    htmlFor="newArrival"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    New Arrival
                  </label>
                </div>
              )}
            />
            <Controller
              name="limitedEdition"
              control={control}
              render={({ field }) => (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="limitedEdition"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <label
                    htmlFor="limitedEdition"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Limited Edition
                  </label>
                </div>
              )}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full bg-black text-white px-6 py-3 rounded-xl font-semibold text-lg tracking-wide shadow-lg hover:bg-gold hover:text-black transition-all duration-300 transform hover:scale-105 ${!isValid || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : "Update Product"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Edit 