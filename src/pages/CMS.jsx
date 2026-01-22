import { useNavigate } from "react-router-dom";
import {
  Hammer,
  Layers,
  Image,
  Percent,
  FileText,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

const cmsModules = [
  {
    id: "home-banners",
    title: "Homepage Banners",
    description: "Manage promotional banners for cement, steel, sand and other materials.",
    icon: Image,
    status: "Active",
  },
  {
    id: "material-content",
    title: "Material Content",
    description: "Edit descriptions, usage details, and specifications of materials.",
    icon: Layers,
    status: "Active",
  },
  {
    id: "pricing-commission",
    title: "Pricing & Commission",
    description: "Set commission rates and pricing rules for vendors and materials.",
    icon: Percent,
    status: "Active",
  },
  {
    id: "vendor-guidelines",
    title: "Vendor Guidelines",
    description: "Rules, onboarding instructions, and quality standards for vendors.",
    icon: Hammer,
    status: "Active",
  },
  {
    id: "terms-conditions",
    title: "Terms & Conditions",
    description: "Legal terms related to material supply, delivery and payments.",
    icon: FileText,
    status: "Active",
  },
  {
    id: "quality-policy",
    title: "Quality & Safety Policy",
    description: "Quality assurance and safety policies for construction materials.",
    icon: ShieldCheck,
    status: "Active",
  },
];

export default function CMS() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          CMS – Construction Materials
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage website and app content related to construction materials.
        </p>
      </div>

      {/* CMS Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cmsModules.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.id}
              onClick={() => navigate(`/cms/${item.id}`)}
              className="bg-white border border-gray-100 rounded-xl p-6 cursor-pointer
                         hover:shadow-md transition-all group"
            >
              {/* Top */}
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-orange-50 group-hover:bg-orange-100">
                  <Icon className="w-6 h-6 text-orange-600" />
                </div>

                <span className="text-xs px-2 py-1 rounded-full bg-green-50 text-green-600">
                  {item.status}
                </span>
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-600">
                {item.title}
              </h3>

              <p className="text-sm text-gray-500 mb-4">
                {item.description}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-xs text-gray-400">
                  Click to manage
                </span>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
