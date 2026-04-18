import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

// Layouts
import PublicLayout from "@/components/layout/PublicLayout";
import AdminLayout from "@/components/layout/AdminLayout";

// Public Pages
import HomePage from "@/pages/public/HomePage";
import CategoryPage from "@/pages/public/CategoryPage";
import ArticleDetailPage from "@/pages/public/ArticleDetailPage";
import SearchPage from "@/pages/public/SearchPage";
import AllArticlesPage from "@/pages/public/AllArticlesPage";
import SavedArticlesPage from "@/pages/public/SavedArticlesPage";
import NotFoundPage from "@/pages/public/NotFoundPage";

// Admin Pages
import LoginPage from "@/pages/admin/LoginPage";
import DashboardPage from "@/pages/admin/DashboardPage";
import ArticleListPage from "@/pages/admin/ArticleListPage";
import ArticleFormPage from "@/pages/admin/ArticleFormPage";
import CategoryListPage from "@/pages/admin/CategoryListPage";
import CommentListPage from "@/pages/admin/CommentListPage";
import SettingsPage from "@/pages/admin/SettingsPage";
import ExpiredTrackingPage from "@/pages/admin/ExpiredTrackingPage";

import { HelmetProvider } from "react-helmet-async";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Portal */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/kategori/:slug" element={<CategoryPage />} />
                <Route path="/artikel/:slug" element={<ArticleDetailPage />} />
                <Route path="/artikel" element={<AllArticlesPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/simpan" element={<SavedArticlesPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>

              {/* Admin CMS */}
              <Route path="/admin/login" element={<LoginPage />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="artikel" element={<ArticleListPage />} />
                <Route path="artikel/baru" element={<ArticleFormPage />} />
                <Route path="artikel/:id/edit" element={<ArticleFormPage />} />
                <Route path="kategori" element={<CategoryListPage />} />
                <Route path="komentar" element={<CommentListPage />} />
                <Route path="tracking-expired" element={<ExpiredTrackingPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
          <Toaster position="top-right" richColors closeButton />
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
