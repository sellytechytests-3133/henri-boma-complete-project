import { useState } from 'react'
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
import { galleryContent } from '../data/mockData'

const ContentModule = () => {
  const [photos, setPhotos] = useState(galleryContent.photos)
  const [videos, setVideos] = useState(galleryContent.videos)
  const [articles, setArticles] = useState(galleryContent.articles)
  const [isAddPhotoModalOpen, setIsAddPhotoModalOpen] = useState(false)
  const [isAddVideoModalOpen, setIsAddVideoModalOpen] = useState(false)
  const [isAddArticleModalOpen, setIsAddArticleModalOpen] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [isViewArticleModalOpen, setIsViewArticleModalOpen] = useState(false)

  const handleDeletePhoto = (photoId) => {
    if (confirm('Are you sure you want to delete this photo?')) {
      setPhotos(photos.filter(p => p.id !== photoId))
    }
  }

  const handleDeleteVideo = (videoId) => {
    if (confirm('Are you sure you want to delete this video?')) {
      setVideos(videos.filter(v => v.id !== videoId))
    }
  }

  const handleDeleteArticle = (articleId) => {
    if (confirm('Are you sure you want to delete this article?')) {
      setArticles(articles.filter(a => a.id !== articleId))
    }
  }

  const handleViewArticle = (article) => {
    setSelectedArticle(article)
    setIsViewArticleModalOpen(true)
  }

  const PhotoForm = ({ onClose, onSave }) => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="photoTitle">Photo Title</Label>
        <Input id="photoTitle" placeholder="Resort Exterior" />
      </div>
      <div>
        <Label htmlFor="photoCategory">Category</Label>
        <Select>
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
        <Label htmlFor="photoUrl">Photo URL</Label>
        <Input id="photoUrl" placeholder="https://media.thehenriboma.com/..." />
      </div>
      <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Drag and drop your photo here, or click to browse
        </p>
        <Button variant="outline" size="sm" className="mt-2">
          Choose File
        </Button>
      </div>
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={() => {
          onSave()
          onClose()
        }}>
          Upload Photo
        </Button>
      </div>
    </div>
  )

  const VideoForm = ({ onClose, onSave }) => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="videoTitle">Video Title</Label>
        <Input id="videoTitle" placeholder="Resort Tour" />
      </div>
      <div>
        <Label htmlFor="videoCategory">Category</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="promotional">Promotional</SelectItem>
            <SelectItem value="tours">Tours</SelectItem>
            <SelectItem value="events">Events</SelectItem>
            <SelectItem value="testimonials">Testimonials</SelectItem>
            <SelectItem value="educational">Educational</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="videoUrl">Video URL</Label>
        <Input id="videoUrl" placeholder="https://media.thehenriboma/video.mp4" />
      </div>
      <div>
        <Label htmlFor="thumbnailUrl">Thumbnail URL</Label>
        <Input id="thumbnailUrl" placeholder="https://media.thehenriboma.com/..." />
      </div>
      <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Drag and drop your video here, or click to browse
        </p>
        <Button variant="outline" size="sm" className="mt-2">
          Choose File
        </Button>
      </div>
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={() => {
          onSave()
          onClose()
        }}>
          Upload Video
        </Button>
      </div>
    </div>
  )

  const ArticleForm = ({ onClose, onSave }) => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="articleTitle">Article Title</Label>
        <Input id="articleTitle" placeholder="The History of Henri Boma Resort" />
      </div>
      <div>
        <Label htmlFor="articleCategory">Category</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="history">History</SelectItem>
            <SelectItem value="culture">Culture</SelectItem>
            <SelectItem value="news">News</SelectItem>
            <SelectItem value="guides">Guides</SelectItem>
            <SelectItem value="events">Events</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="articleExcerpt">Excerpt</Label>
        <Textarea id="articleExcerpt" placeholder="Brief description of the article..." />
      </div>
      <div>
        <Label htmlFor="articleContent">Full Content</Label>
        <Textarea 
          id="articleContent" 
          placeholder="Write your full article content here..." 
          className="min-h-[200px]"
        />
      </div>
      <div>
        <Label htmlFor="articleAuthor">Author</Label>
        <Input id="articleAuthor" placeholder="Resort Management" />
      </div>
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={() => {
          onSave()
          onClose()
        }}>
          Publish Article
        </Button>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Content Management</h1>
          <p className="text-muted-foreground">Manage photos, videos, and articles for the resort gallery</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
      </div>

      <Tabs defaultValue="photos" className="space-y-6">
        <TabsList>
          <TabsTrigger value="photos">Photos</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="articles">Articles</TabsTrigger>
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
                  onSave={() => console.log('Save photo')}
                />
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map((photo) => (
              <Card key={photo.id} className="admin-card overflow-hidden">
                <div className="aspect-video relative">
                  <img 
                    src={photo.url} 
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
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={() => handleDeletePhoto(photo.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold">{photo.title}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <Badge variant="outline">{photo.category}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(photo.uploadDate).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="videos" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Video Gallery</h2>
            <Dialog open={isAddVideoModalOpen} onOpenChange={setIsAddVideoModalOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Upload Video
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Upload New Video</DialogTitle>
                  <DialogDescription>
                    Add a new video to the resort gallery
                  </DialogDescription>
                </DialogHeader>
                <VideoForm 
                  onClose={() => setIsAddVideoModalOpen(false)}
                  onSave={() => console.log('Save video')}
                />
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <Card key={video.id} className="admin-card overflow-hidden">
                <div className="aspect-video relative">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                      <Video className="h-6 w-6 text-black ml-1" />
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <Button variant="secondary" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="secondary" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={() => handleDeleteVideo(video.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold">{video.title}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <Badge variant="outline">{video.category}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(video.uploadDate).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="articles" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Articles</h2>
            <Dialog open={isAddArticleModalOpen} onOpenChange={setIsAddArticleModalOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Write Article
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Write New Article</DialogTitle>
                  <DialogDescription>
                    Create a new article for the resort blog
                  </DialogDescription>
                </DialogHeader>
                <ArticleForm 
                  onClose={() => setIsAddArticleModalOpen(false)}
                  onSave={() => console.log('Save article')}
                />
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {articles.map((article) => (
              <Card key={article.id} className="admin-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{article.title}</CardTitle>
                    <div className="flex items-center space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewArticle(article)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteArticle(article.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{article.excerpt}</p>
                  
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{article.category}</Badge>
                    <div className="text-xs text-muted-foreground">
                      <p>By {article.author}</p>
                      <p>{new Date(article.publishDate).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Publish
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* View Article Modal */}
      <Dialog open={isViewArticleModalOpen} onOpenChange={setIsViewArticleModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedArticle?.title}</DialogTitle>
            <DialogDescription>
              By {selectedArticle?.author} • {selectedArticle && new Date(selectedArticle.publishDate).toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>
          {selectedArticle && (
            <div className="space-y-4">
              <Badge variant="outline">{selectedArticle.category}</Badge>
              <div className="prose max-w-none">
                <p className="text-muted-foreground italic">{selectedArticle.excerpt}</p>
                <div className="mt-4">
                  {selectedArticle.content}
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsViewArticleModalOpen(false)}>
                  Close
                </Button>
                <Button>
                  Edit Article
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ContentModule

