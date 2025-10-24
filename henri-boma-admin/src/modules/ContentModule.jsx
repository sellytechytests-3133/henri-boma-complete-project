import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Image, Video, FileText, Upload, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import api, { MEDIA_BASE_URL } from '@/lib/api'

const ContentModule = () => {
  const [photos, setPhotos] = useState([])
  const [videos, setVideos] = useState([])
  const [articles, setArticles] = useState([])
  const [events, setEvents] = useState([])
  const [isAddPhotoModalOpen, setIsAddPhotoModalOpen] = useState(false)
  const [isAddVideoModalOpen, setIsAddVideoModalOpen] = useState(false)
  const [isAddArticleModalOpen, setIsAddArticleModalOpen] = useState(false)
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [isViewArticleModalOpen, setIsViewArticleModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Load content on component mount
  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = async () => {
    try {
      setLoading(true)
      const [galleryRes, blogsRes, eventsRes] = await Promise.all([
        api.get('/content/public/gallery?limit=100'),
        api.get('/content/public/blogs?limit=100'),
        api.get('/content/public/events?limit=100')
      ])
      
      const galleryItems = galleryRes.data.items || []
      setPhotos(galleryItems.filter(item => item.type === 'image'))
      setVideos(galleryItems.filter(item => item.type === 'video'))
      setArticles(blogsRes.data.items || [])
      setEvents(eventsRes.data.items || [])
    } catch (error) {
      setError('Failed to load content')
    } finally {
      setLoading(false)
    }
  }

  const handleUploadFile = async (file, title, category, type) => {
    try {
      setLoading(true)
      setError('')
      
      const formData = new FormData()
      formData.append('file', file)
      formData.append('title', title)
      formData.append('category', category)
      formData.append('type', type)
      
      const response = await api.post('/content/gallery', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      setSuccess('File uploaded successfully')
      loadContent() // Reload content
    } catch (error) {
      setError(error.response?.data?.message || 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateBlog = async (blogData) => {
    try {
      setLoading(true)
      setError('')
      
      await api.post('/content/blogs', blogData)
      setSuccess('Blog created successfully')
      loadContent() // Reload content
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create blog')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateEvent = async (eventData) => {
    try {
      setLoading(true)
      setError('')
      
      await api.post('/content/events', eventData)
      setSuccess('Event created successfully')
      loadContent() // Reload content
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create event')
    } finally {
      setLoading(false)
    }
  }

  const PhotoForm = ({ onClose, onSave }) => {
    const [formData, setFormData] = useState({
      title: '',
      category: 'resort',
      file: null
    })

    const handleFileChange = (e) => {
      setFormData(prev => ({ ...prev, file: e.target.files[0] }))
    }

    const handleSubmit = async () => {
      if (!formData.file) {
        setError('Please select a file')
        return
      }
      
      await handleUploadFile(formData.file, formData.title, formData.category, 'image')
      onClose()
    }

    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="photoTitle">Photo Title</Label>
          <Input 
            id="photoTitle" 
            placeholder="Resort Exterior"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="photoCategory">Category</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="resort">Resort</SelectItem>
              <SelectItem value="facilities">Facilities</SelectItem>
              <SelectItem value="rooms">Rooms</SelectItem>
              <SelectItem value="dining">Dining</SelectItem>
              <SelectItem value="events">Events</SelectItem>
              <SelectItem value="nature">Nature</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="photoFile">Photo File</Label>
          <Input 
            id="photoFile" 
            type="file" 
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Uploading...' : 'Upload Photo'}
          </Button>
        </div>
      </div>
    )
  }

  // Similar updates for VideoForm, ArticleForm, EventForm...

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Content Management</h1>
          <p className="text-muted-foreground">Manage photos, videos, articles, and events</p>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <Alert className="bg-green-50 border-green-200">
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="admin-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <Image className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{photos.length}</p>
                <p className="text-sm text-muted-foreground">Photos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="admin-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <Video className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{videos.length}</p>
                <p className="text-sm text-muted-foreground">Videos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="admin-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{articles.length}</p>
                <p className="text-sm text-muted-foreground">Articles</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="admin-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{events.length}</p>
                <p className="text-sm text-muted-foreground">Events</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="photos" className="space-y-6">
        <TabsList>
          <TabsTrigger value="photos">Photos</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="articles">Articles</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>

        <TabsContent value="photos" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Photo Gallery</h2>
            <Dialog open={isAddPhotoModalOpen} onOpenChange={setIsAddPhotoModalOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Upload Photo
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Upload New Photo</DialogTitle>
                  <DialogDescription>
                    Add a new photo to the resort gallery
                  </DialogDescription>
                </DialogHeader>
                <PhotoForm 
                  onClose={() => setIsAddPhotoModalOpen(false)}
                  onSave={() => {}}
                />
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map((photo) => (
              <Card key={photo.id} className="admin-card overflow-hidden">
                <div className="aspect-video relative">
                  <img 
                    src={photo.public_url} 
                    alt={photo.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <Button variant="secondary" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="secondary" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="secondary" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold">{photo.title}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <Badge variant="outline">{photo.category}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(photo.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Similar updates for videos, articles, events tabs... */}
      </Tabs>
    </div>
  )
}

export default ContentModule