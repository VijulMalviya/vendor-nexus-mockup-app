
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Building, Upload, CheckCircle, Clock, ArrowRight, ArrowLeft } from 'lucide-react';

interface VendorOnboardingProps {
  onComplete: () => void;
}

const VendorOnboarding: React.FC<VendorOnboardingProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    vendorType: '',
    businessName: '',
    businessAddress: '',
    businessPhone: '',
    businessWebsite: '',
    businessLogo: '',
    documents: [] as string[],
    description: ''
  });

  const steps = [
    { id: 1, title: 'Vendor Type', description: 'Select your business type' },
    { id: 2, title: 'Business Info', description: 'Enter your business details' },
    { id: 3, title: 'Documents', description: 'Upload verification documents' }
  ];

  const vendorTypes = [
    { value: 'manufacturer', label: 'Manufacturer', description: 'I manufacture products' },
    { value: 'dealer', label: 'Dealer', description: 'I sell products from manufacturers' },
    { value: 'broker', label: 'Broker', description: 'I connect buyers and sellers' }
  ];

  const documentTypes = [
    'Business Registration Certificate',
    'Tax Identification Number',
    'Trade License',
    'GST Registration',
    'Bank Statement'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (documentType: string) => {
    // Mock file upload
    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, documentType]
    }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      localStorage.setItem('vendorOnboarded', 'true');
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.vendorType !== '';
      case 2:
        return formData.businessName && formData.businessAddress && formData.businessPhone;
      case 3:
        return formData.documents.length >= 2;
      default:
        return false;
    }
  };

  const progressPercentage = (currentStep / 3) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to MarketPlace</h1>
          <p className="text-muted-foreground">Complete your vendor profile to start selling</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {steps.map((step) => (
              <div key={step.id} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {currentStep > step.id ? <CheckCircle className="h-4 w-4" /> : step.id}
                </div>
                {step.id < 3 && (
                  <div className={`w-24 h-1 mx-2 ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building className="h-5 w-5" />
              <span>Step {currentStep}: {steps[currentStep - 1].title}</span>
            </CardTitle>
            <p className="text-muted-foreground">{steps[currentStep - 1].description}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentStep === 1 && (
              <div className="space-y-4">
                <Label className="text-base font-medium">Select your vendor type</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {vendorTypes.map((type) => (
                    <Card 
                      key={type.value}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        formData.vendorType === type.value 
                          ? 'ring-2 ring-blue-600 bg-blue-50' 
                          : ''
                      }`}
                      onClick={() => handleInputChange('vendorType', type.value)}
                    >
                      <CardContent className="p-4 text-center">
                        <h3 className="font-semibold mb-2">{type.label}</h3>
                        <p className="text-sm text-muted-foreground">{type.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="businessName">Business Name *</Label>
                    <Input
                      id="businessName"
                      value={formData.businessName}
                      onChange={(e) => handleInputChange('businessName', e.target.value)}
                      placeholder="Enter your business name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="businessPhone">Business Phone *</Label>
                    <Input
                      id="businessPhone"
                      value={formData.businessPhone}
                      onChange={(e) => handleInputChange('businessPhone', e.target.value)}
                      placeholder="Enter your business phone"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="businessAddress">Business Address *</Label>
                  <Textarea
                    id="businessAddress"
                    value={formData.businessAddress}
                    onChange={(e) => handleInputChange('businessAddress', e.target.value)}
                    placeholder="Enter your complete business address"
                  />
                </div>
                
                <div>
                  <Label htmlFor="businessWebsite">Business Website (Optional)</Label>
                  <Input
                    id="businessWebsite"
                    value={formData.businessWebsite}
                    onChange={(e) => handleInputChange('businessWebsite', e.target.value)}
                    placeholder="https://your-website.com"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Business Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Tell us about your business..."
                  />
                </div>
                
                <div>
                  <Label>Business Logo</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-muted-foreground mb-2">Click to upload your business logo</p>
                    <Button variant="outline" size="sm">
                      Choose File
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium">Upload Required Documents</Label>
                  <p className="text-sm text-muted-foreground mb-4">
                    Please upload at least 2 documents for verification
                  </p>
                </div>
                
                <div className="space-y-3">
                  {documentTypes.map((docType) => (
                    <div key={docType} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          formData.documents.includes(docType)
                            ? 'bg-green-100 text-green-600'
                            : 'bg-gray-100 text-gray-400'
                        }`}>
                          {formData.documents.includes(docType) ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <Clock className="h-4 w-4" />
                          )}
                        </div>
                        <span className="font-medium">{docType}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {formData.documents.includes(docType) ? (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Uploaded
                          </Badge>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleFileUpload(docType)}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Upload
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                {formData.documents.length >= 2 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-green-800 font-medium">
                        Minimum documents uploaded! Your profile will be reviewed within 24-48 hours.
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-6 border-t">
              <Button 
                variant="outline" 
                onClick={handlePrevious}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              
              <Button 
                onClick={handleNext}
                disabled={!isStepValid()}
              >
                {currentStep === 3 ? 'Complete Setup' : 'Next'}
                {currentStep < 3 && <ArrowRight className="h-4 w-4 ml-2" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VendorOnboarding;
