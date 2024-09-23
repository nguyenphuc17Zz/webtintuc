import { Routes } from '@angular/router';
import { DangnhapComponent } from './auth/dangnhap/dangnhap.component';
import { DangkiComponent } from './auth/dangki/dangki.component';
import { QuenmatkhauComponent } from './auth/quenmatkhau/quenmatkhau.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { EditProfileComponent } from './admin/edit-profile/edit-profile.component';
import { UserComponent } from './admin/user/user.component';
import { CategoryComponent } from './admin/category/category.component';
import { TagComponent } from './admin/tag/tag.component';
import { FormArticleComponent } from './admin/form-article/form-article.component'
import { ArticleComponent } from './admin/article/article.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'trangchu',
        pathMatch: 'full'
    },

    {
        path: 'dangki',
        component: DangkiComponent
    }
    ,
    {
        path: 'dangnhap',
        component: DangnhapComponent

    },
    {
        path: 'quenmatkhau',
        component: QuenmatkhauComponent

    }
    ,

    {
        path: 'admin',
        redirectTo: 'admin/dashboard',
        pathMatch: 'full'

    },
    {
        path: 'admin/dashboard',
        component: DashboardComponent
    },
    {
        path: 'admin/editprofile',
        component: EditProfileComponent
    },
    {
        path: 'admin/user',
        component: UserComponent
    },
    {
        path: 'admin/category',
        component: CategoryComponent
    },
    {
        path: 'admin/tag',
        component: TagComponent
    },
    {
        path: 'admin/articleform',
        component: FormArticleComponent
    },
    {
        path: 'admin/article',
        component: ArticleComponent
    },
];
