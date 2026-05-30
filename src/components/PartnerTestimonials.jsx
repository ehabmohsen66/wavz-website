import React from 'react';

// Light-weight replacements for shadcn components
const Card = ({ className, children }) => (
  <div className={`rounded-xl border bg-white text-slate-950 shadow-sm ${className || ''}`}>
    {children}
  </div>
);

const CardHeader = ({ className, children }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className || ''}`}>
    {children}
  </div>
);

const CardContent = ({ className, children }) => (
  <div className={`p-6 pt-0 ${className || ''}`}>
    {children}
  </div>
);

const Avatar = ({ className, children }) => (
  <div className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className || ''}`}>
    {children}
  </div>
);

const AvatarImage = ({ src, alt, className }) => (
  <img className={`aspect-square h-full w-full ${className || ''}`} src={src} alt={alt} />
);

const AvatarFallback = ({ className, children }) => (
  <div className={`flex h-full w-full items-center justify-center rounded-full bg-slate-100 font-medium text-slate-500 ${className || ''}`}>
    {children}
  </div>
);

export const PartnerTestimonials = () => {
    return (
        <section className="py-16 md:py-32 bg-slate-50">
            <div className="mx-auto max-w-6xl space-y-8 px-6 md:space-y-16">
                <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center md:space-y-12">
                    <h2 className="text-4xl font-medium lg:text-5xl text-[#082D4A]">Some of Our Partner Testimonials</h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                    {/* Testimonial 1 */}
                    <Card className="flex flex-col gap-8 sm:col-span-2 sm:p-6 lg:row-span-2 border-slate-200 h-full">
                        <CardHeader className="pb-0 sm:p-0">
                            <img
                                className="h-6 w-fit opacity-70"
                                src="/8b56ffb305d960f5_org.png"
                                alt="Tietoevry Logo"
                                height="24"
                                width="auto"
                            />
                        </CardHeader>
                        <CardContent className="sm:p-0 flex-1 flex flex-col justify-between">
                            <blockquote className="flex flex-col justify-between h-full gap-6">
                                <p className="text-xl font-medium text-slate-800 leading-relaxed">“Our partnership with WAVZ, brings new opportunities for growth and digital transformation in the region. With the global economy witnessing rapid development, it is crucial to have a partner that provides exceptional resources, expertise, and well-trained personnel who understand the local culture. This partnership strengthens our commitment to success and enables us to realize our vision for the region”</p>

                                <div className="flex items-center gap-3 mt-4">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage
                                            src="/Edgars-Biberis.jpg"
                                            alt="Edgars Bīberis"
                                        />
                                        <AvatarFallback>EB</AvatarFallback>
                                    </Avatar>

                                    <div>
                                        <cite className="text-sm font-bold text-slate-900 not-italic">Edgars Bīberis</cite>
                                        <span className="text-slate-500 block text-sm">Regional Director of Business Development at Tietoevry</span>
                                    </div>
                                </div>
                            </blockquote>
                        </CardContent>
                    </Card>

                    {/* Testimonial 2 */}
                    <Card className="flex flex-col justify-between md:col-span-2 border-slate-200 h-full">
                        <CardHeader className="pb-2">
                            <img
                                className="h-7 w-fit opacity-70"
                                src="/nevis_logo.png"
                                alt="Nevis Logo"
                                height="28"
                                width="auto"
                            />
                        </CardHeader>
                        <CardContent className="pt-2 flex-1 flex flex-col justify-between">
                            <blockquote className="flex flex-col justify-between h-full gap-6">
                                <p className="text-xl font-medium text-slate-800 leading-relaxed">“We support banks and financial service providers in the ME/A region in implementing a simple and secure solution for authenticating their customers. We look forward to building a global network of Partners. This is why we invest heavily in employees and partners like WAVZ, who bring the necessary expertise to build that global network”</p>

                                <div className="flex items-center gap-3 mt-2">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage
                                            src="/Stephen01.jpg.webp"
                                            alt="Stephan Schweizer"
                                        />
                                        <AvatarFallback>SS</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <cite className="text-sm font-bold text-slate-900 not-italic">Stephan Schweizer</cite>
                                        <span className="text-slate-500 block text-sm">CEO of Nevis Security AG</span>
                                    </div>
                                </div>
                            </blockquote>
                        </CardContent>
                    </Card>

                    {/* Testimonial 3 */}
                    <Card className="flex flex-col justify-between md:col-span-2 border-slate-200 h-full">
                        <CardHeader className="pb-2">
                            <img
                                className="h-5 w-fit opacity-70"
                                src="/Teradata_logo_(2024).svg.png"
                                alt="Teradata Logo"
                                height="20"
                                width="auto"
                            />
                        </CardHeader>
                        <CardContent className="pt-2 flex-1 flex flex-col justify-between">
                            <blockquote className="flex flex-col justify-between h-full gap-6">
                                <p className="text-slate-700 text-sm leading-relaxed">“At Teradata, we know that people thrive when empowered with trusted information. We are excited to begin working with WAVZ and leverage their expertise in the Egyptian market to bring Teradata’s innovative platform and Trusted AI capabilities to local businesses.”</p>

                                <div className="flex items-center gap-3 mt-2">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage
                                            src="/Khaled-Hammouda.jpg"
                                            alt="Khaled Hammouda"
                                        />
                                        <AvatarFallback>KH</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <cite className="text-sm font-bold text-slate-900 not-italic leading-tight">Khaled Hammouda</cite>
                                        <span className="text-slate-500 block text-xs mt-0.5">General Manager at Teradata Egypt</span>
                                    </div>
                                </div>
                            </blockquote>
                        </CardContent>
                    </Card>


                </div>
            </div>
        </section>
    )
}
