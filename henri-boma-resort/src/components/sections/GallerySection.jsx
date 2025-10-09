import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Play, Calendar, Clock, ExternalLink } from 'lucide-react'
import { galleryItems } from '../../data/mockData'

const GallerySection = () => {
  const [activeTab, setActiveTab] = useState('photos')
  const [selectedImage, setSelectedImage] = useState(null)

  const openImageModal = (image) => {
    setSelectedImage(image)
    // This will be enhanced with a proper modal in the next phase
  }

  const closeImageModal = () => {
    setSelectedImage(null)
  }

  return (
    <section id="gallery" className="section-padding bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">Gallery</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore our beautiful resort through photos, videos, and stories
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-card rounded-lg p-1 shadow-md">
            <button
              onClick={() => setActiveTab('photos')}
              className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'photos'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Photos
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'videos'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Videos
            </button>
            <button
              onClick={() => setActiveTab('articles')}
              className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'articles'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Articles
            </button>
          </div>
        </div>

        {/* Photos Tab */}
        {activeTab === 'photos' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryItems.photos.map((photo) => (
              <div 
                key={photo.id} 
                className="bg-card rounded-lg overflow-hidden shadow-md card-hover cursor-pointer"
                onClick={() => openImageModal(photo)}
              >
                <div className="h-64 overflow-hidden">
                  <img 
                    src={photo.image} 
                    alt={photo.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-semibold mb-1">{photo.title}</h4>
                  <span className="text-sm text-primary bg-primary/10 px-2 py-1 rounded">
                    {photo.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Videos Tab */}
        {activeTab === 'videos' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {galleryItems.videos.map((video) => (
              <div key={video.id} className="bg-card rounded-lg overflow-hidden shadow-md card-hover">
                <div className="relative h-64 overflow-hidden group cursor-pointer">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                      <Play className="h-8 w-8 text-primary ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-sm">
                    {video.duration}
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-semibold">{video.title}</h4>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Articles Tab */}
        {activeTab === 'articles' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryItems.articles.map((article) => (
              <div key={article.id} className="bg-card rounded-lg overflow-hidden shadow-md card-hover">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h4 className="text-lg font-semibold mb-2">{article.title}</h4>
                  <p className="text-muted-foreground text-sm mb-4">{article.excerpt}</p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {article.date}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {article.readTime}
                    </div>
                  </div>
                  <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Read Article
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Image Modal (Simple version) */}
        {selectedImage && (
          <div 
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={closeImageModal}
          >
            <div className="max-w-4xl max-h-full">
              <img 
                src={selectedImage.image} 
                alt={selectedImage.title}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
              <div className="text-center mt-4">
                <h3 className="text-white text-xl font-semibold">{selectedImage.title}</h3>
                <p className="text-gray-300">{selectedImage.category}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default GallerySection

