import React, { useEffect, useRef } from 'react'
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

// Register the FilePond plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);


const Add = ({token}) => {
  const pondRef = useRef()

  const validationSchema = z.object({
    images: z.any()
      .refine(() => images.length > 0, {
        message: 'Please select at least one file.',
      })
      .refine(() => images.length < 5, {
        message: 'You can upload maximus 4 images at once',
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

  const { control, handleSubmit, reset, watch, formState: { errors, isSubmitSuccessful } } = useForm({
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
 
  async function onSubmit(values) {
    try {
      const formData = new FormData()

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
      for (let i=0; i < values.images.length; i++) {
        formData.append(`image${i+1}`, values.images[i].file);
      }

      const response = await axios.post(backendUrl + '/api/product/add', formData,
        {headers: {token}}
      );
      if (response.data.success) {
        toast.success(response.data.message + " Stock saved.")
      } else {
        toast.error(response.data.message)
        console(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    reset()
    pondRef.current.removeFiles()
  }, [isSubmitSuccessful])

  const images = watch('images') || [];

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-purple-100 px-4 py-10 transition-all">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8 sm:p-12 flex flex-col gap-8 animate-fade-up">
        {/* Editorial Header */}
        <div className="mb-2">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-1 tracking-tight">Add New Product</h1>
          <div className="w-16 h-1 bg-pink-200 rounded-full mb-2" />
          <p className="text-sm text-gray-500 font-sans">Fill in the details below to add a new product to your luxury collection.</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col w-full items-start gap-6">
          {/* Product Images */}
          <div className="w-full">
            <label className="block text-base font-medium font-serif text-gray-800 mb-2">Product Images</label>
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
                    labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                  />
                )}
              />
              {errors.images && <p className="text-red-500 text-xs mt-1">{errors.images.message}</p>}
              <p className="text-xs text-gray-400 mt-1">Upload up to 4 images</p>
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
            className="w-full bg-black text-white px-6 py-3 rounded-xl font-semibold text-lg tracking-wide shadow-lg hover:bg-gold hover:text-black transition-all duration-300 transform hover:scale-105"
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  )
}

export default Add