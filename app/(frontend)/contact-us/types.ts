export interface EntranceData {
  enableSection: boolean;
  title: string;
  image: {
    url: string;
    alt: string;
  };
  address: {
    line1: string;
    line2: string;
  };
  whatsappGroup: {
    enableButton: boolean;
    buttonText: string;
  };
}

export interface ContactPageData {
  hero: {
    title: string;
    backgroundImage: {
      url: string;
      alt: string;
    };
    breadcrumb: string;
  };
  contactInfo: {
    sectionTitle: string;
    description: string;
    mainAddress: {
      line1: string;
      line2: string;
    };
    phone: string;
    email: string;
    mapEmbed: string;
    showMap: boolean;
  };
  brothersEntrance: EntranceData;
  sistersEntrance: EntranceData;
  parkingNotice: {
    enableSection: boolean;
    title: string;
    message: any;
    hadithQuote: {
      showQuote: boolean;
      quoteText: string;
      source: string;
    };
    backgroundColor: string;
  };
  contactForm: {
    enableSection: boolean;
    sectionTitle: string;
    description: string;
    image: {
      url: string;
      alt: string;
    };
    formSettings: {
      nameLabel: string;
      emailLabel: string;
      topicLabel: string;
      messageLabel: string;
      submitButtonText: string;
    };
    topicOptions: string[];
    recipientEmail?: string;
    successMessage: string;
  };
  bottomQuote: {
    enableSection: boolean;
    quoteText: string;
    author: string;
    donateButtonUrl: string;
    showShareButton: boolean;
    showDonateButton: boolean;
  };
}
